import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
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
import { PessoaResponseDTO } from '../../core/models/dto/pessoa/pessoa-response.dto';
import { BemService } from '../../core/service/bem/bem.service';
import { ToastrService } from 'ngx-toastr';
import { BemResponseDTO } from '../../core/models/dto/bem/bem-response.dto';
import { TipoBem, TipoBemDescricao } from '../../core/enum/bem/tipo-bem.enum';
import { BemTipoEnvolvimento, BemTipoEnvolvimentoDescricao } from '../../core/enum/bem/bem-tipo-envolvimento.enum';

declare var bootstrap: any;

@Component({
  selector: 'app-boletim-ocorrencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './boletim-ocorrencia.component.html',
  styleUrls: ['./boletim-ocorrencia.component.css']
})
export class BoletimOcorrenciaComponent {
  // === INJECTIONS ===
  private fb = inject(FormBuilder);
  private boletimService = inject(BoletimOcorrenciaService);
  private delegaciaService = inject(DelegaciaService);
  private pessoaService = inject(PessoaService);
  private bemService = inject(BemService);
  private authService = inject(AuthService);
  private enderecoService = inject(EnderecoService);
  private toast = inject(ToastrService);

  // === SIGNALS ===
  delegaciaId = signal<number | null>(null);
  boletins = signal<BoletimOcorrenciaResponseDTO[]>([]);
  delegacias = signal<DelegaciaResponseDTO[]>([]);
  pessoasFiltradas = signal<PessoaResponseDTO[]>([]);
  bensFiltrados = signal<BemResponseDTO[]>([]);
  filtrosPessoa = signal<{ nome: string; cpf: string; sexo: string }>({ nome: '', cpf: '', sexo: '' });
  filtrosBem = signal<{ descricao: string; tipo: string; marca: string }>({ descricao: '', tipo: '', marca: '' });
  pessoaMap = new Map<number, PessoaResponseDTO>();
  bemMap = new Map<number, BemResponseDTO>();

  // === ENUMS ===
  ufs = enumToKeyValueArray(UF, UFDescricao);
  origens = enumToKeyValueArray(OrigemForcaPolicial, OrigemForcaPolicialDescricao);
  tiposEnvolvimento = enumToKeyValueArray(TipoEnvolvimento, TipoEnvolvimentoDescricao);
  generos = enumToKeyValueArray(Genero, GeneroDescricao);
  tiposBem = enumToKeyValueArray(TipoBem, TipoBemDescricao);
  bemTipoEnvolvimento = enumToKeyValueArray(BemTipoEnvolvimento, BemTipoEnvolvimentoDescricao);

  // === FORM ===
  boletimForm = this.fb.group({
    id: [null as number | null],
    origemForcaPolicial: ['', Validators.required],
    dataOcorrencia: ['', Validators.required],
    boletim: ['', Validators.required],
    natureza: ['', Validators.required],
    representacao: [''],
    delegaciaId: [null as number | null, Validators.required],

    endereco: this.fb.group({
      pais: ['BRASIL'],
      uf: [''],
      municipio: [''],
      bairro: [''],
      logradouro: [''],
      numero: [''],
      cep: ['']
    }),

    pessoasEnvolvidas: this.fb.array([]),
    bensEnvolvidos: this.fb.array([])
  });

  // === COMPUTED ===
  pessoasArray = computed(() => this.boletimForm.get('pessoasEnvolvidas') as FormArray);
  bensArray = computed(() => this.boletimForm.get('bensEnvolvidos') as FormArray);
  isEdicao = signal(false);

  constructor() {
    effect(() => {
      const id = this.authService.getDelegaciaId();
      this.delegaciaId.set(id);
      if (id) {
        this.boletimForm.patchValue({ delegaciaId: id });
        this.carregarBoletins();
      }
    });

    this.carregarDelegacias();
    this.setupCepAutoComplete();
  }

  // === FORM ARRAY ===
  private criarPessoaFormGroup(dto?: { pessoaId?: number; tipoEnvolvimento?: string; observacao?: string }): FormGroup {
    return this.fb.group({
      pessoaId: [dto?.pessoaId ?? null, Validators.required],
      tipoEnvolvimento: [dto?.tipoEnvolvimento ?? '', Validators.required],
      observacao: [dto?.observacao ?? '']
    });
  }

  private criarBemFormGroup(dto?: { bemId?: number; tipoEnvolvimento?: string; observacao?: string }): FormGroup {
    return this.fb.group({
      bemId: [dto?.bemId ?? null, Validators.required],
      tipoEnvolvimento: [dto?.tipoEnvolvimento ?? '', Validators.required],
      observacao: [dto?.observacao ?? '']
    });
  }

  // === BUSCA ===
  buscarPessoas(): void {
    const { nome, cpf, sexo } = this.filtrosPessoa();
    if (!nome && !cpf && !sexo) {
      this.toast.info('Preencha ao menos um filtro.');
      return; // ← SEM `return this.toast.info(...)`
    }

    this.pessoaService.getPessoasFiltradas({ nome, cpf, sexo }).subscribe({
      next: (res) => this.pessoasFiltradas.set(res.content || []),
      error: () => this.toast.error('Erro ao buscar pessoas.')
    });
  }

  buscarBens(): void {
    const { descricao, tipo, marca } = this.filtrosBem();
    if (!descricao && !tipo && !marca) {
      this.toast.info('Preencha ao menos um filtro.');
      return;
    }

    this.bemService.getBensFiltrados({ descricao, tipoBem: tipo, marca }).subscribe({
      next: (page) => this.bensFiltrados.set(page.content || []),
      error: () => this.toast.error('Erro ao buscar bens.')
    });
  }

  // === ADICIONAR / REMOVER ===
  adicionarPessoa(pessoa: PessoaResponseDTO, tipo: string): void {
    if (this.pessoasArray().controls.some(c => c.get('pessoaId')?.value === pessoa.id)) {
      this.toast.warning('Pessoa já adicionada.');
      return; // ← SEM `return this.toast.warning(...)`
    }
    this.pessoasArray().push(this.criarPessoaFormGroup({ pessoaId: pessoa.id!, tipoEnvolvimento: tipo }));
  }

  removerPessoa(index: number): void {
    this.pessoasArray().removeAt(index);
    this.toast.info('Pessoa removida.');
  }

  adicionarBem(bem: BemResponseDTO, tipo: string): void {
    if (this.bensArray().controls.some(c => c.get('bemId')?.value === bem.id)) {
      this.toast.warning('Bem já adicionado.');
      return;
    }
    this.bensArray().push(this.criarBemFormGroup({ bemId: bem.id!, tipoEnvolvimento: tipo }));
  }

  removerBem(index: number): void {
    this.bensArray().removeAt(index);
  }

  // === GET NOME / DESCRIÇÃO ===
  getPessoaNome(pessoaId: number): string {
    const p = this.pessoaMap.get(pessoaId) || this.pessoasFiltradas().find(p => p.id === pessoaId);
    return p?.nome || '—';
  }

  getBemDescricao(bemId: number): string {
    const b = this.bemMap.get(bemId) || this.bensFiltrados().find(b => b.id === bemId);
    return b ? `${b.descricao} (${b.marca} ${b.modelo})`.trim() : '—';
  }

  // === CARREGAR DETALHES ===
  private carregarDetalhesPessoas(ids: number[]): void {
    if (!ids.length) { this.pessoaMap.clear(); return; }
    this.pessoaService.getByIds(ids).subscribe(p => {
      this.pessoaMap.clear();
      p.forEach(x => this.pessoaMap.set(x.id!, x));
    });
  }

  private carregarDetalhesBens(ids: number[]): void {
    if (!ids.length) { this.bemMap.clear(); return; }
    this.bemService.getByIds(ids).subscribe(b => {
      this.bemMap.clear();
      b.forEach(x => this.bemMap.set(x.id!, x));
    });
  }

  // === DADOS ===
  private carregarBoletins(): void {
    const id = this.delegaciaId();
    if (!id) return;
    this.boletimService.getByDelegacia(id).subscribe({
      next: (data) => this.boletins.set(data || []),
      error: () => this.toast.error('Erro ao carregar boletins.')
    });
  }

  private carregarDelegacias(): void {
    this.delegaciaService.getDelegacias().subscribe(d => this.delegacias.set(d));
  }

  // === MODAL ===
  abrirModal(boletim?: BoletimOcorrenciaResponseDTO): void {
    this.resetar();

    if (boletim) {
      this.isEdicao.set(true);
      this.boletimService.getById(boletim.id).subscribe({
        next: (data) => {
          const model = BoletimOcorrenciaMapper.toFormModel(data);
          this.boletimForm.patchValue(model);

          this.pessoasArray().clear();
          model.pessoasEnvolvidas.forEach((p: any) => this.pessoasArray().push(this.criarPessoaFormGroup(p)));

          this.bensArray().clear();
          model.bensEnvolvidos?.forEach((b: any) => this.bensArray().push(this.criarBemFormGroup(b)));

          const pessoaIds = model.pessoasEnvolvidas
            .map((p: any) => p.pessoaId)
            .filter((id: number | null): id is number => id != null);

          const bemIds = model.bensEnvolvidos
            ?.map((b: any) => b.bemId)
            .filter((id: number | null): id is number => id != null) || [];

          if (pessoaIds.length) this.carregarDetalhesPessoas(pessoaIds);
          if (bemIds.length) this.carregarDetalhesBens(bemIds);

          this.abrirModalBootstrap();
        }
      });
    } else {
      this.isEdicao.set(false);
      this.boletimForm.patchValue({ delegaciaId: this.delegaciaId() });
      this.abrirModalBootstrap();
    }
  }

  private abrirModalBootstrap(): void {
    const modal = document.getElementById('boletimModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  private resetar(): void {
    this.boletimForm.reset();
    this.pessoasArray().clear();
    this.bensArray().clear();
    this.isEdicao.set(false);
    this.filtrosPessoa.set({ nome: '', cpf: '', sexo: '' });
    this.filtrosBem.set({ descricao: '', tipo: '', marca: '' });
  }

  // === SALVAR ===
  salvar(): void {
    if (this.boletimForm.invalid) {
      this.boletimForm.markAllAsTouched();
      this.toast.warning('Corrija os campos obrigatórios.');
      return;
    }

    const formValue = this.boletimForm.getRawValue();

    const pessoasInvalidas = formValue.pessoasEnvolvidas?.some((p: any) => !p.pessoaId);
    const bensInvalidos = formValue.bensEnvolvidos?.some((b: any) => !b.bemId);

    if (pessoasInvalidas || bensInvalidos) {
      this.toast.error('Todos os envolvidos devem estar selecionados.');
      return;
    }

    const payload = BoletimOcorrenciaMapper.toRequest(formValue);
    const id = formValue.id;

    if (id) {
      this.boletimService.update(id, payload).subscribe({
        next: () => {
          this.toast.success('Boletim atualizado!');
          this.resetar();
          this.carregarBoletins();
        },
        error: () => this.toast.error('Erro ao atualizar.')
      });
    } else {
      this.boletimService.create(payload).subscribe({
        next: () => {
          this.toast.success('Boletim criado!');
          this.resetar();
          this.carregarBoletins();
        },
        error: () => this.toast.error('Erro ao criar.')
      });
    }
  }

  confirmarExclusao(boletim: BoletimOcorrenciaResponseDTO): void {
    if (!confirm(`Tem certeza que deseja excluir o BO ${boletim.boletim}?`)) return;

    this.boletimService.delete(boletim.id).subscribe({
      next: () => {
        this.toast.success('Boletim excluído com sucesso!');
        this.carregarBoletins();
      },
      error: () => this.toast.error('Erro ao excluir boletim.')
    });
  }
  // === FILTROS ===
  atualizarFiltroPessoaNome(e: Event) { this.filtrosPessoa.update(f => ({ ...f, nome: (e.target as HTMLInputElement).value })); }
  atualizarFiltroPessoaCpf(e: Event) { this.filtrosPessoa.update(f => ({ ...f, cpf: (e.target as HTMLInputElement).value })); }
  atualizarFiltroPessoaSexo(e: Event) { this.filtrosPessoa.update(f => ({ ...f, sexo: (e.target as HTMLSelectElement).value })); }

  atualizarFiltroBemDescricao(e: Event) { this.filtrosBem.update(f => ({ ...f, descricao: (e.target as HTMLInputElement).value })); }
  atualizarFiltroBemMarca(e: Event) { this.filtrosBem.update(f => ({ ...f, marca: (e.target as HTMLInputElement).value })); }
  atualizarFiltroBemTipo(e: Event) { this.filtrosBem.update(f => ({ ...f, tipo: (e.target as HTMLSelectElement).value })); }

  formatarCep(event: Event): void {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5, 8);
    this.boletimForm.get('endereco.cep')?.setValue(value, { emitEvent: false });
  }
  private setupCepAutoComplete(): void {
    this.boletimForm.get('endereco.cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((cep): cep is string => !!cep && /^\d{5}-\d{3}$/.test(cep))
      )
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        this.enderecoService.getEnderecoByCep(cepLimpo).subscribe({
          next: (data) => {
            this.boletimForm.get('endereco')?.patchValue({
              logradouro: data.logradouro ?? '',
              bairro: data.bairro ?? '',
              municipio: data.localidade ?? '',
              uf: data.uf ?? '',
              pais: 'BRASIL',
              numero: '',
              cep: cep
            });
          },
          error: () => this.toast.error('Erro ao buscar CEP.')
        });
      });
  }
}