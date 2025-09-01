import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InqueritoPolicialService, InqueritoPolicial, InqueritoPolicialRequestDTO } from '../../core/service/inquerito-policial/inquerito-policial.service';
import { Delegacia, DelegaciaService } from '../../core/service/delegacia/delegacia.service';
import { Peca, OrigemForcaPolicial, SituacaoInquerito, Genero, TipoEnvolvimento, PecaDescricao, SituacaoInqueritoDescricao, OrigemForcaPolicialDescricao, GeneroDescricao, TipoEnvolvimentoDescricao } from '../../../shared/enums/index.enum';
import { Pessoa, PessoaService } from '../../core/service/pessoa/pessoa.service';
import { AuthService } from '../../core/guards/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { ModalSeletorPessoaComponent } from '../../../shared/components/modal/pessoa/modal-seletor-pessoa/modal-seletor-pessoa.component';
import { enumToKeyValueArray } from '../../../shared/enums/enum-utils';
import { Observable } from 'rxjs';
import { PessoaEnvolvimentoService } from '../../core/service/pessoa-envolvimento/pessoa-envolvimento.service';

declare var bootstrap: any;


@Component({
  selector: 'app-inquerito-policial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './inquerito-policial.component.html',
  styleUrls: ['./inquerito-policial.component.css']
})
export class InqueritoPolicialComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  inqueritoForm: FormGroup;
  inqueritos: InqueritoPolicial[] = [];
  pessoas: Pessoa[] = [];
  pessoasFiltradas: Pessoa[] = [];
  delegacias: Delegacia[] = [];
  isEdicao: boolean = false;
  inqueritoSelecionado: InqueritoPolicial | null = null;
  envolvimentos: { [key: number]: string } = {};
  pessoasSelecionadas: number[] = [];
  delegaciaLogadaId: number | null = null;
  selecionadas: Pessoa[] = [];
  pessoasSelecionadasDetalhes: Pessoa[] = [];
  pessoasEncontradas: Pessoa[] = [];

  pecas = enumToKeyValueArray(Peca, PecaDescricao);
  origens = enumToKeyValueArray(OrigemForcaPolicial, OrigemForcaPolicialDescricao);
  situacoes = enumToKeyValueArray(SituacaoInquerito, SituacaoInqueritoDescricao);
  generos = enumToKeyValueArray(Genero, GeneroDescricao);
  tipoEnvovilmentos = enumToKeyValueArray(TipoEnvolvimento, TipoEnvolvimentoDescricao);
  PecaDescricao = PecaDescricao;
  SituacaoInqueritoDescricao = SituacaoInqueritoDescricao;
  pessoasSelecionadasIds: number[] = [];


  filtroPessoa: string[] = [];

  filtroNome = new FormControl<string>('', { nonNullable: true });
  filtroCpf = new FormControl<string>('', { nonNullable: true });
  filtroGenero = new FormControl<string>('', { nonNullable: true });

  constructor(
    private fb: FormBuilder,
    private inqueritoService: InqueritoPolicialService,
    private delegaciaService: DelegaciaService,
    private pessoaService: PessoaService,
    private authService: AuthService,
    private pessoaEnvolvimentoService: PessoaEnvolvimentoService
  ) {
    this.inqueritoForm = this.fb.group({
      id: [null],
      numeroJustica: ['', Validators.required],
      ordemIp: ['', Validators.required],
      data: ['', Validators.required],
      peca: ['', Validators.required],
      situacaoInquerito: ['', Validators.required],
      origemForcaPolicial: ['', Validators.required],
      naturezaDoDelito: ['', Validators.required],
      observacao: [''],
      delegaciaId: [null, Validators.required],
      pessoasEnvolvidas: this.fb.array([])
    });
    this.pessoasSelecionadasDetalhes = this.pessoas.filter(p =>
      this.pessoasSelecionadas.includes(p.id!)
    );
  }

  ngOnInit(): void {
    this.delegaciaLogadaId = this.authService.getDelegaciaId();

    if (this.delegaciaLogadaId) {
      this.inqueritoForm.patchValue({ delegaciaId: this.delegaciaLogadaId });
      this.carregarInqueritos(this.delegaciaLogadaId);
    }

    this.carregarDelegacias();

    this.filtroNome.valueChanges.subscribe(() => this.aplicarFiltro());
    this.filtroCpf.valueChanges.subscribe(() => this.aplicarFiltro());
    this.filtroGenero.valueChanges.subscribe(() => this.aplicarFiltro());
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

  carregarInqueritos(delegaciaId: number): void {
    this.inqueritoService.getInqueritosByDelegacia(delegaciaId).subscribe({
      next: (inqueritos) => {
        this.inqueritos = (inqueritos || []).map((inq: any) => {
          const pessoasEnvolvidas = (inq.pessoasEnvolvidas || []).map((env: any) => ({
            id: env.id,
            tipoEnvolvimento: env.tipoEnvolvimento,
            observacao: env.observacao,
            pessoa: {
              id: env.pessoa?.id,
              nome: env.pessoa?.nome,
              cpf: env.pessoa?.cpf,
              sexo: env.pessoa?.sexo
            }
          }));

          // campo auxiliar para facilitar exibição em tabelas/listas
          const pessoasEnvolvidasResumo = pessoasEnvolvidas.map((e: any) => ({
            id: e.pessoa?.id,
            nome: e.pessoa?.nome,
            cpf: e.pessoa?.cpf,
            tipoEnvolvimento: e.tipoEnvolvimento
          }));

          return { ...inq, pessoasEnvolvidas, pessoasEnvolvidasResumo };
        });

        console.log('📦 Inquéritos carregados:', this.inqueritos);
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar inquéritos: ' + error.message;
        console.error('❌ Erro ao carregar inquéritos:', error);
      }
    });
  }


  // carregarPessoasEnvolvidas(inqueritoId: number): void {
  //   this.pessoaEnvolvimentoService.listarTodos().subscribe({
  //     next: (envolvimentos) => {
  //       const selecionadas = envolvimentos.filter(e => e.inqueritoId === inqueritoId);
  //       this.pessoasSelecionadasDetalhes = selecionadas.map(e => e.pessoa);
  //       this.pessoasSelecionadasIds = selecionadas.map(e => e.pessoaId!);
  //       console.log('Pessoas envolvidas carregadas:', this.pessoasSelecionadasDetalhes);
  //     },
  //     error: (err) => console.error('Erro ao carregar pessoas envolvidas:', err)
  //   });
  // }

  carregarDelegacias(): void {
    this.delegaciaService.getDelegacias().subscribe({
      next: (data) => this.delegacias = data,
      error: (err) => alert(err.message)
    });
  }


  buscarPessoas(): void {
    const filtros = {
      nome: this.filtroNome.value?.trim() || undefined,
      cpf: (this.filtroCpf.value || '').replace(/\D/g, '') || undefined,
      sexo: this.filtroGenero.value || undefined   // << chave correta para o backend
    };

    console.log('➡️ Filtros enviados:', filtros);

    this.pessoaService.getPessoasFiltradas(filtros).subscribe({
      next: (res) => {
        console.log('✅ Resposta completa da API:', res);
        this.pessoasFiltradas = res?.content ?? [];
        console.log('👤 Pessoas filtradas:', this.pessoasFiltradas);
      },
      error: (err) => console.error('❌ Erro ao buscar pessoas:', err)
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
  getDescricaoPeca(peca: string): string {
    return PecaDescricao[peca as Peca] || peca;
  }

  getDescricaoSituacao(situacao: string): string {
    return SituacaoInqueritoDescricao[situacao as SituacaoInquerito] || situacao;
  }

  salvarInquerito(): void {

    const formValue = this.inqueritoForm.value;

    // Monta o objeto inquerito exatamente como o backend espera
    const inquerito: InqueritoPolicial = {
      id: formValue.id,
      numeroJustica: formValue.numeroJustica,
      ordemIp: formValue.ordemIp,
      data: formValue.data, // deve ser string "yyyy-MM-dd" para LocalDate
      peca: formValue.peca, // deve bater com enum do backend: "APF", "PORTARIA", etc.
      situacaoInquerito: formValue.situacaoInquerito, // enum: "EM_ANDAMENTO", etc.
      origemForcaPolicial: formValue.origemForcaPolicial, // enum
      naturezaDoDelito: formValue.naturezaDoDelito,
      observacao: formValue.observacao,
      delegaciaId: this.delegaciaLogadaId!, // pega sempre da delegacia logada
      pessoasEnvolvidas: this.pessoasSelecionadas
        .filter(id => id != null)
        .map(id => ({
          pessoaId: id,
          tipoEnvolvimento: this.envolvimentos[id] || 'VITIMA',
          observacao: '', // ou pegar do formulário, se tiver
        }))
    };

    const payload: InqueritoPolicialRequestDTO = {
      inqueritoPolicial: inquerito,       // 🔹 obrigatoriamente dentro de 'inqueritoPolicial'
      pessoasEnvolvidas: inquerito.pessoasEnvolvidas! // 🔹 lista de pessoas envolvidas
    };
    console.log('Payload enviado:', payload);

    if (this.isEdicao && inquerito.id) {
      this.inqueritoService.updateInquerito(inquerito.id, payload).subscribe({
        next: () => {
          this.carregarInqueritos(this.delegaciaLogadaId!);
          this.resetarFormulario();
          alert('Inquérito atualizado com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    } else {
      this.inqueritoService.createInquerito(payload).subscribe({
        next: () => {
          this.carregarInqueritos(this.delegaciaLogadaId!);
          this.resetarFormulario();
          alert('Inquérito criado com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  abrirModalEdicao(inquerito: InqueritoPolicial): void {
    this.isEdicao = true;

    const pessoasEnvolvidas: any[] = inquerito.pessoasEnvolvidas || [];

    // agora a origem é env.pessoa.id (não env.pessoaId)
    this.pessoasSelecionadas = pessoasEnvolvidas
      .filter(pe => pe?.pessoa?.id != null)
      .map(pe => pe.pessoa.id);

    this.envolvimentos = {};
    pessoasEnvolvidas.forEach(pe => {
      const pid = pe?.pessoa?.id;
      if (pid != null) this.envolvimentos[pid] = pe.tipoEnvolvimento || 'VITIMA';
    });

    this.inqueritoForm.patchValue({
      id: inquerito.id,
      numeroJustica: inquerito.numeroJustica,
      ordemIp: inquerito.ordemIp,
      data: inquerito.data,
      peca: inquerito.peca,
      situacaoInquerito: inquerito.situacaoInquerito,
      origemForcaPolicial: inquerito.origemForcaPolicial,
      naturezaDoDelito: inquerito.naturezaDoDelito,
      observacao: inquerito.observacao,
      delegaciaId: inquerito.delegaciaId
    });

    // detalhes para a lista “Pessoas Selecionadas”
    this.pessoasSelecionadasDetalhes = pessoasEnvolvidas
      .filter(pe => pe?.pessoa)
      .map(pe => pe.pessoa as Pessoa);

    console.log('🛠️ Edição - pessoasSelecionadas:', this.pessoasSelecionadas);
    console.log('🛠️ Edição - pessoasSelecionadasDetalhes:', this.pessoasSelecionadasDetalhes);
    console.log('🛠️ Edição - envolvimentos:', this.envolvimentos);
  }



  confirmarExclusao(inquerito: InqueritoPolicial): void {
    this.inqueritoSelecionado = inquerito;
  }

  excluirInquerito(): void {
    if (this.inqueritoSelecionado?.id) {
      this.inqueritoService.deleteInquerito(this.inqueritoSelecionado.id).subscribe({
        next: () => {
          this.carregarInqueritos(this.delegaciaLogadaId!);
          this.inqueritoSelecionado = null;
          alert('Inquérito excluído com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  adicionarPessoasSelecionadas() {
    this.inqueritoForm.get('pessoasEnvolvidas')?.setValue(this.pessoasSelecionadas);
    const modalElement = document.getElementById('modalPessoa');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  resetarFormulario(): void {
    this.inqueritoForm.reset();
    this.pessoasSelecionadas = [];
    this.pessoasSelecionadasDetalhes = [];
    this.envolvimentos = {};
    this.isEdicao = false;
  }
}
