import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoletimOcorrenciaService } from '../../core/service/boletim-ocorrencia/boletim-ocorrencia.service';
import { DelegaciaService } from '../../core/service/delegacia/delegacia.service';
import { Pessoa, PessoaService } from '../../core/service/pessoa/pessoa.service';
import { AuthService } from '../../core/guards/auth/auth.service';
import { enumToKeyValueArray } from '../../../shared/enums/enum-utils';
import { Genero, GeneroDescricao, OrigemForcaPolicial, OrigemForcaPolicialDescricao, SituacaoInquerito, TipoEnvolvimento, TipoEnvolvimentoDescricao, UF, UFDescricao } from '../../../shared/enums/index.enum';
import { debounceTime, distinctUntilChanged, filter, map, of } from 'rxjs';
import { Endereco, EnderecoService } from '../../core/service/endereco/endereco.service';
import { PessoaEnvolvimento } from '../../core/service/pessoa-envolvimento/pessoa-envolvimento.service';
import { forkJoin } from 'rxjs';
import { BoletimOcorrenciaRequestDTO } from '../../core/models/dto/boletim-ocorrencia/boletim-ocorrencia-request.dto';
import { BoletimOcorrenciaResponseDTO } from '../../core/models/dto/boletim-ocorrencia/boletim-ocorrencia-response.dto';
import { BoletimOcorrenciaMapper } from '../../core/mapper/boletim-ocorrencia/boletim-ocorrencia.mapper';
import { DelegaciaResponseDTO } from '../../core/models/dto/delegacia/delegacia-response.dto';

declare var bootstrap: any;

@Component({
  selector: 'app-boletim-ocorrencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './boletim-ocorrencia.component.html',
  styleUrls: ['./boletim-ocorrencia.component.css']
})
export class BoletimOcorrenciaComponent implements OnInit {

  totalPages: number = 0;
  totalElements: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  successMessage: string = '';
  errorMessage: string = '';
  boletins: BoletimOcorrenciaResponseDTO[] = [];
  pessoas: Pessoa[] = [];
  pessoasFiltradas: Pessoa[] = [];
  delegacias: DelegaciaResponseDTO[] = [];
  isEdicao: boolean = false;
  boletimSelecionado: BoletimOcorrenciaResponseDTO | null = null;
  pessoasSelecionadas: number[] = [];
  pessoasSelecionadasIds: number[] = [];
  pessoasSelecionadasDetalhes: Pessoa[] = [];
  envolvimentos: { [key: number]: string } = {};
  delegaciaLogadaId: number | null = null;
  pessoa: Pessoa | null = null;
  ufs = enumToKeyValueArray(UF, UFDescricao);
  origens = enumToKeyValueArray(OrigemForcaPolicial, OrigemForcaPolicialDescricao);
  tipoEnvolvimentos = enumToKeyValueArray(TipoEnvolvimento, TipoEnvolvimentoDescricao);
  generos = enumToKeyValueArray(Genero, GeneroDescricao);

  boletimForm: FormGroup;

  filtroPessoa: string[] = [];

  filtroNome = new FormControl<string>('', { nonNullable: true });
  filtroCpf = new FormControl<string>('', { nonNullable: true });
  filtroGenero = new FormControl<string>('', { nonNullable: true });

  constructor(
    private fb: FormBuilder,
    private boletimService: BoletimOcorrenciaService,
    private delegaciaService: DelegaciaService,
    private pessoaService: PessoaService,
    private authService: AuthService,
    private enderecoService: EnderecoService
  ) {
    this.boletimForm = this.fb.group({
      id: [null],
      origemForcaPolicial: ['', Validators.required],
      dataOcorrencia: ['', Validators.required],
      boletim: ['', Validators.required],
      natureza: ['', Validators.required],
      representacao: [''],
      delegaciaId: [null, Validators.required],

      endereco: this.fb.group({
        pais: ['BRASIL', Validators.required],
        uf: ['', Validators.required],
        municipio: ['', Validators.required],
        bairro: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        cep: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{5}-[0-9]{3}$')]
        ]
      }),

      pessoasEnvolvidas: this.fb.array([]) // já no padrão DTO
    });

  }

  ngOnInit(): void {
    this.delegaciaLogadaId = this.authService.getDelegaciaId();
    if (this.delegaciaLogadaId) {
      this.boletimForm.patchValue({ delegaciaId: this.delegaciaLogadaId });
      this.carregarBoletins(this.delegaciaLogadaId);
    }
    this.carregarDelegacias();

    this.filtroNome.valueChanges.subscribe(() => this.aplicarFiltro());
    this.filtroCpf.valueChanges.subscribe(() => this.aplicarFiltro());
    this.filtroGenero.valueChanges.subscribe(() => this.aplicarFiltro());

    this.boletimForm.get('enderecoForm.cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(cep => cep && cep.replace(/\D/g, '').length === 8)
      )
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        this.enderecoService.getEnderecoByCep(cepLimpo).subscribe({
          next: (data) => {
            const enderecoForm = this.boletimForm.get('enderecoForm');
            enderecoForm?.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              municipio: data.localidade,
              uf: data.uf,
              pais: 'Brasil'
            });
          },
          error: (err) => {
            console.error('Erro ao buscar CEP', err);
          }
        });
      });
  }

  get pessoasEnvolvidasIds(): FormArray {
    return this.boletimForm.get('pessoasEnvolvidasIds') as FormArray;
  }

  private aplicarFiltro(): void {
    const nome = (this.filtroNome.value ?? '').toLowerCase();
    const cpf = (this.filtroCpf.value ?? '').replace(/\D/g, '');
    const genero = this.filtroGenero.value ?? '';
    this.pessoasFiltradas = this.pessoas.filter(p =>
      (!nome || p.nome?.toLowerCase().includes(nome)) &&
      (!cpf || (p.cpf ?? '').replace(/\D/g, '') === cpf) &&
      (!genero || p.sexo === genero)
    );
  }

  carregarBoletins(delegaciaId: number): void {
    this.boletimService.getByDelegacia(delegaciaId).subscribe({
      next: (boletins: BoletimOcorrenciaResponseDTO[]) => {
        this.boletins = (boletins || []).map((bo: any) => {
          const { pessoasEnvolvidas, pessoasEnvolvidasResumo } = this.mapearEnvolvidos(bo.pessoasEnvolvidas);

          return {
            ...bo,
            dataOcorrencia: this.formatarData(bo.dataOcorrencia),
            pessoasEnvolvidas,
            pessoasEnvolvidasResumo,
            delegaciaNome: bo.delegacia?.nome || 'Não informado'
          };
        });
        console.log('📑 Boletins carregados (com resumo):', this.boletins);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar boletins: ' + err.message;
        console.error('❌ Erro ao carregar boletins:', err);
      }
    });
  }

  private mapearEnvolvidos(envolvidos: any[]): { pessoasEnvolvidas: any[], pessoasEnvolvidasResumo: any[] } {
    const pessoasEnvolvidas = (envolvidos || []).map((env: any) => ({
      id: env.id,
      tipoEnvolvimento: env.tipoEnvolvimento,
      observacao: env.observacao,
      pessoa: env.pessoa || {}
    }));

    const pessoasEnvolvidasResumo = pessoasEnvolvidas.map(e => ({
      id: e.pessoa?.id,
      nome: e.pessoa?.nome,
      cpf: e.pessoa?.cpf,
      tipoEnvolvimento: e.tipoEnvolvimento
    }));

    return { pessoasEnvolvidas, pessoasEnvolvidasResumo };
  }

  private formatarData(data: any): string {
    if (Array.isArray(data)) {
      const [ano, mes, dia, hora = 0, minuto = 0] = data;
      if ([ano, mes, dia].some(v => v == null)) {
        console.warn('Data inválida recebida:', data);
        return '';
      }
      return new Date(ano, mes - 1, dia, hora, minuto).toISOString();
    } else if (data) {
      const date = new Date(data);
      if (!isNaN(date.getTime())) return date.toISOString();
      console.warn('Data inválida recebida:', data);
      return '';
    }
    return '';
  }

  carregarDelegacias(): void {
    this.delegaciaService.getDelegacias().subscribe({
      next: (data) => this.delegacias = data,
      error: (err) => alert(err.message)
    });
  }

  adicionarPessoa(pessoa: Pessoa): void {
    if (!this.pessoasSelecionadas.includes(pessoa.id!)) {
      this.pessoasSelecionadas.push(pessoa.id!);
      this.pessoasSelecionadasDetalhes.push(pessoa);
      this.envolvimentos[pessoa.id!] = 'VITIMA'; // default
    }
  }

  removerPessoa(pessoaId: number): void {
    this.pessoasSelecionadas = this.pessoasSelecionadas.filter(id => id !== pessoaId);
    this.pessoasSelecionadasDetalhes = this.pessoasSelecionadasDetalhes.filter(p => p.id !== pessoaId);
    delete this.envolvimentos[pessoaId];
  }

  abrirModalEdicao(boletim: BoletimOcorrenciaResponseDTO): void {
    this.isEdicao = true;
    this.boletimSelecionado = boletim;

    this.boletimForm.patchValue({
      id: boletim.id,
      boletim: boletim.boletim,
      dataOcorrencia: boletim.dataOcorrencia,
      natureza: boletim.natureza,
      representacao: boletim.representacao,
      origemForcaPolicial: boletim.origemForcaPolicial,
    });

    if (boletim.endereco) {
      this.boletimForm.get('enderecoForm')?.patchValue({
        id: boletim.endereco.id,
        logradouro: boletim.endereco.logradouro,
        numero: boletim.endereco.numero,
        bairro: boletim.endereco.bairro,
        municipio: boletim.endereco.municipio,
        uf: boletim.endereco.uf,
        pais: boletim.endereco.pais,
        cep: boletim.endereco.cep
      });
    }

    this.pessoasSelecionadas = boletim.pessoasEnvolvidas?.map(p => p.pessoaId) || [];
    this.pessoasSelecionadasDetalhes = boletim.pessoasEnvolvidas?.map(p => ({
      id: p.pessoaId,
      nome: (p as any).pessoa?.nome || '',
      cpf: (p as any).pessoa?.cpf || '',
      tipoEnvolvimento: p.tipoEnvolvimento
    })) || [];

    this.envolvimentos = {};
    (boletim.pessoasEnvolvidas || []).forEach(p => {
      this.envolvimentos[p.pessoaId] = p.tipoEnvolvimento;
    });
  }

  resetarFormulario(): void {
    this.boletimForm.reset();
    this.pessoasSelecionadas = [];
    this.pessoasSelecionadasDetalhes = [];
    this.envolvimentos = {};
    this.isEdicao = false;
    this.boletimSelecionado = null;
  }

  salvarBoletim(): void {
    const formValue = this.boletimForm.value;
    const payload = BoletimOcorrenciaMapper.formToRequest(formValue);

    console.log('➡️ Payload enviado:', payload);
    if (this.isEdicao && this.boletimSelecionado?.id) {
      this.boletimService.update(this.boletimSelecionado.id, payload).subscribe({
        next: () => {
          this.carregarBoletins(this.delegaciaLogadaId!);
          this.resetarFormulario();
          this.successMessage = 'Boletim atualizado com sucesso!';
        },
        error: err => this.errorMessage = err.message
      });
    } else {
      this.boletimService.create(payload).subscribe({
        next: () => {
          this.carregarBoletins(this.delegaciaLogadaId!);
          this.resetarFormulario();
          this.successMessage = 'Boletim criado com sucesso!';
        },
        error: err => this.errorMessage = err.message
      });
    }
  }


  buscarPessoas(page: number = 0, size: number = 10): void {
    const filtros = {
      nome: this.filtroNome.value?.trim() || undefined,
      cpf: (this.filtroCpf.value || '').replace(/\D/g, '') || undefined,
      sexo: this.filtroGenero.value || undefined
    };

    console.log('➡️ Filtros enviados:', filtros);

    this.pessoaService.getPessoasFiltradas(filtros, page, size).subscribe({
      next: (res) => {
        console.log('✅ Resposta completa da API:', res);
        this.pessoasFiltradas = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.pageNumber = res.pageable.pageNumber;
        this.pageSize = res.pageable.pageSize;
        console.log('👤 Pessoas filtradas:', this.pessoasFiltradas);
      },
      error: (err) => console.error('❌ Erro ao buscar pessoas:', err)
    });
  }

  confirmarExclusao(boletim: BoletimOcorrenciaResponseDTO): void {
    this.boletimSelecionado = boletim;
  }

  excluirBoletim(): void {
    if (this.boletimSelecionado?.id) {
      this.boletimService.delete(this.boletimSelecionado.id).subscribe({
        next: () => { this.carregarBoletins(this.delegaciaLogadaId!); this.resetarFormulario(); alert('Boletim excluído com sucesso!'); },
        error: err => alert(err.message)
      });
    }
  }
}
