import { Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InqueritoPolicialService, } from '../../core/service/inquerito-policial/inquerito-policial.service';
import { DelegaciaService } from '../../core/service/delegacia/delegacia.service';
import { Peca, OrigemForcaPolicial, SituacaoInquerito, Genero, TipoEnvolvimento, PecaDescricao, SituacaoInqueritoDescricao, OrigemForcaPolicialDescricao, GeneroDescricao, TipoEnvolvimentoDescricao } from '../../../shared/enums/index.enum';
import { PessoaService } from '../../core/service/pessoa/pessoa.service';
import { AuthService } from '../../core/guards/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { enumToKeyValueArray } from '../../../shared/enums/enum-utils';
import { DelegaciaResponseDTO } from '../../core/models/dto/delegacia/delegacia-response.dto';
import { PessoaResponseDTO } from '../../core/models/dto/pessoa/pessoa-response.dto';
import { PessoaEnvolvimentoRequestDTO } from '../../core/models/dto/pessoa-envolvimento/pessoa-envolvimento-request.dto';
import { InqueritoPolicialResponseDTO } from '../../core/models/dto/inquerito-policial/inquerito-policial-response.dto';
import { InqueritoPolicialMapper } from '../../core/mapper/inquerito-policial/inquerito-policial.mapper';
import { ToastrService } from 'ngx-toastr';
import { BemEnvolvimentoRequestDTO } from '../../core/models/dto/bem-envolvimento/bem-envolvimento-request.dto';
import { BemTipoEnvolvimento, BemTipoEnvolvimentoDescricao } from '../../core/enum/bem/bem-tipo-envolvimento.enum';
import { BemResponseDTO } from '../../core/models/dto/bem/bem-response.dto';
import { BemService } from '../../core/service/bem/bem.service';
import { TipoBem, TipoBemDescricao } from '../../core/enum/bem/tipo-bem.enum';


declare var bootstrap: any;


@Component({
  selector: 'app-inquerito-policial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule],
  templateUrl: './inquerito-policial.component.html',
  styleUrls: ['./inquerito-policial.component.css']
})
export class InqueritoPolicialComponent {
  // === INJECTIONS ===
  private fb = inject(FormBuilder);
  private inqueritoService = inject(InqueritoPolicialService);
  private delegaciaService = inject(DelegaciaService);
  private pessoaService = inject(PessoaService);
  private authService = inject(AuthService);
  private bemService = inject(BemService);
  private toast = inject(ToastrService);
  private pessoaMap = new Map<number, PessoaResponseDTO>();
  private bemMap = new Map<number, BemResponseDTO>();


  // === SIGNALS ===
  delegaciaId = signal<number | null>(null);
  inqueritos = signal<InqueritoPolicialResponseDTO[]>([]);
  delegacias = signal<DelegaciaResponseDTO[]>([]);
  pessoasFiltradas = signal<PessoaResponseDTO[]>([]);
  bensFiltrados = signal<BemResponseDTO[]>([]);
  filtros = signal<any>({ nome: '', cpf: '', sexo: '' });
  filtrosBem = signal<{ descricao: string; tipo: string; marca: string }>({
    descricao: '', tipo: '', marca: ''
  });

  // === FORM ===
  inqueritoForm: FormGroup = this.fb.group({
    id: [null as number | null],
    numeroJustica: ['', Validators.required],
    ordemIp: [0, [Validators.required, Validators.min(0)]],
    data: ['', Validators.required],
    peca: ['', Validators.required],
    situacaoInquerito: ['', Validators.required],
    origemForcaPolicial: ['', Validators.required],
    naturezaDoDelito: ['', Validators.required],
    observacao: [''],
    delegaciaId: [null as number | null, Validators.required],
    pessoasEnvolvidas: this.fb.array([]),
    bensEnvolvidos: this.fb.array([])
  });

  // === ENUMS ===
  pecas = enumToKeyValueArray(Peca, PecaDescricao);
  origens = enumToKeyValueArray(OrigemForcaPolicial, OrigemForcaPolicialDescricao);
  situacoes = enumToKeyValueArray(SituacaoInquerito, SituacaoInqueritoDescricao);
  tiposEnvolvimento = enumToKeyValueArray(TipoEnvolvimento, TipoEnvolvimentoDescricao);
  generos = enumToKeyValueArray(Genero, GeneroDescricao);
  bemTipoEnvolvimento = enumToKeyValueArray(BemTipoEnvolvimento, BemTipoEnvolvimentoDescricao);
  tiposBem = enumToKeyValueArray(TipoBem, TipoBemDescricao); // ← ADICIONEI
  // === COMPUTED ===
  pessoasArray = computed(() => this.inqueritoForm.get('pessoasEnvolvidas') as FormArray);
  bensArray = computed(() => this.inqueritoForm.get('bensEnvolvidos') as FormArray);
  isEdicao = signal(false);

  constructor() {
    // Carrega delegacia logada
    effect(() => {
      const id = this.authService.getDelegaciaId();
      this.delegaciaId.set(id);
      if (id) {
        this.inqueritoForm.patchValue({ delegaciaId: id });
        this.carregarInqueritos();
      }
    });

    this.carregarDelegacias();
  }

  // === FORM ARRAY HELPERS ===
  private criarPessoaFormGroup(dto?: Partial<PessoaEnvolvimentoRequestDTO>): FormGroup {
    return this.fb.group({
      pessoaId: [dto?.pessoaId ?? null, Validators.required],
      tipoEnvolvimento: [dto?.tipoEnvolvimento ?? '', Validators.required],
      observacao: [dto?.observacao ?? '']
    });
  }

  private criarBemFormGroup(dto?: Partial<BemEnvolvimentoRequestDTO>): FormGroup {
    return this.fb.group({
      bemId: [dto?.bemId ?? null, Validators.required],
      tipoEnvolvimento: [dto?.tipoEnvolvimento ?? '', Validators.required],
      observacao: [dto?.observacao ?? '']
    });
  }
  // === ACTIONS ===
  buscarPessoas(): void {
    const { nome, cpf, sexo } = this.filtros();
    if (!nome && !cpf && !sexo) {
      this.toast.info('Preencha ao menos um filtro.');
      return;
    }

    this.pessoaService.getPessoasFiltradas({ nome, cpf, sexo }).subscribe({
      next: (res) => {
        this.pessoasFiltradas.set(res.content || []);
        this.toast.success(`${this.pessoasFiltradas().length} pessoa(s) encontrada(s).`);
      },
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
      next: (page) => {
        this.bensFiltrados.set(page.content || []);
      },
      error: () => this.toast.error('Erro ao buscar bens.')
    });
  }

  adicionarPessoa(pessoa: PessoaResponseDTO, tipo: string): void {
    if (this.pessoasArray().controls.some(c => c.get('pessoaId')?.value === pessoa.id)) {
      this.toast.warning('Pessoa já adicionada.');
      return;
    }

    this.pessoasArray().push(this.criarPessoaFormGroup({
      pessoaId: pessoa.id!,
      tipoEnvolvimento: tipo
    }));

    this.toast.success('Pessoa adicionada.');
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

    this.bensArray().push(this.criarBemFormGroup({
      bemId: bem.id!,
      tipoEnvolvimento: tipo,
      observacao: ''
    }));
  }

  removerBem(index: number): void {
    this.bensArray().removeAt(index);
  }

  salvar(): void {
    if (this.inqueritoForm.invalid) {
      this.inqueritoForm.markAllAsTouched();
      this.toast.warning('Corrija os campos obrigatórios.');
      return;
    }

    const formValue = this.inqueritoForm.getRawValue();
    const payload = InqueritoPolicialMapper.toRequest(formValue);
    const id = formValue.id;

    if (id) {
      this.inqueritoService.update(id, payload).subscribe({
        next: () => {
          this.toast.success('Inquérito atualizado!');
          this.resetar();
          this.carregarInqueritos();
        },
        error: () => this.toast.error('Erro ao atualizar.')
      });
    } else {
      this.inqueritoService.create(payload).subscribe({
        next: () => {
          this.toast.success('Inquérito criado!');
          this.resetar();
          this.carregarInqueritos();
        },
        error: () => this.toast.error('Erro ao criar.')
      });
    }
  }

  excluir(inquerito: InqueritoPolicialResponseDTO): void {
    if (confirm('Excluir inquérito?')) {
      this.inqueritoService.delete(inquerito.id).subscribe({
        next: () => {
          this.toast.success('Excluído com sucesso.');
          this.carregarInqueritos();
        },
        error: () => this.toast.error('Erro ao excluir.')
      });
    }
  }

  atualizarFiltroNome(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtros.update(f => ({ ...f, nome: target.value }));
  }

  atualizarFiltroCpf(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtros.update(f => ({ ...f, cpf: target.value }));
  }

  atualizarFiltroSexo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtros.update(f => ({ ...f, sexo: target.value }));
  }

  atualizarFiltroDescricao(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtrosBem.update(f => ({ ...f, descricao: target.value }));
  }

  atualizarFiltroMarca(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtrosBem.update(f => ({ ...f, marca: target.value }));
  }

  atualizarFiltroTipo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtrosBem.update(f => ({ ...f, tipo: target.value }));
  }

  private carregarDelegacias(): void {
    this.delegaciaService.getDelegacias().subscribe({
      next: (data) => this.delegacias.set(data),
      error: () => this.toast.error('Erro ao carregar delegacias.')
    });
  }

  private carregarInqueritos(): void {
    const id = this.delegaciaId();
    if (!id) return;

    this.inqueritoService.getByDelegacia(id).subscribe({
      next: (data) => this.inqueritos.set(data || []),
      error: () => this.toast.error('Erro ao carregar inquéritos.')
    });
  }

  // === UI ===
  abrirModal(inquerito?: InqueritoPolicialResponseDTO): void {
    console.log('=== ABRIR MODAL CHAMADO ===');
    console.log('inquerito recebido:', inquerito);

    this.resetar();

    if (inquerito) {
      console.log('MODO: EDIÇÃO');
      this.isEdicao.set(true);

      console.log('Carregando inquérito por ID:', inquerito.id);
      this.inqueritoService.getById(inquerito.id).subscribe({
        next: (data) => {
          console.log('DADOS DO BACKEND (getById):', data);

          const model = InqueritoPolicialMapper.toFormModel(data);
          console.log('MODEL PARA O FORM (toFormModel):', model);

          console.log('pessoasEnvolvidas no model:', model.pessoasEnvolvidas);

          // === PATCH NO FORMULÁRIO ===
          this.inqueritoForm.patchValue(model);
          console.log('FORMULÁRIO APÓS patchValue:', this.inqueritoForm.getRawValue());

          // === RECRIA FORMARRAY DE PESSOAS ===
          this.pessoasArray().clear();
          console.log('FormArray limpo. Tamanho:', this.pessoasArray().length);

          model.pessoasEnvolvidas.forEach((p, index) => {
            console.log(`Adicionando pessoa ${index}:`, p);
            this.pessoasArray().push(this.criarPessoaFormGroup(p));
          });

          console.log('FormArray final (value):', this.pessoasArray().value);
          console.log('FormArray final (controls):', this.pessoasArray().controls);

          // Dentro do next do getById
          this.bensArray().clear();
          model.bensEnvolvidos?.forEach(b => this.bensArray().push(this.criarBemFormGroup(b)));

          const bemIds = model.bensEnvolvidos
            ?.map(b => b.bemId)
            .filter((id): id is number => id != null) || [];

          if (bemIds.length > 0) {
            this.carregarDetalhesBens(bemIds);
          }

          // === EXTRAI pessoaIds ===
          const pessoaIds = model.pessoasEnvolvidas
            .map(p => p.pessoaId)
            .filter((id): id is number => id != null);

          console.log('pessoaIds extraídos:', pessoaIds);

          if (pessoaIds.length > 0) {
            console.log('Carregando detalhes das pessoas...');
            this.carregarDetalhesPessoas(pessoaIds);
          } else {
            console.log('Nenhuma pessoa para carregar detalhes.');
          }

          // === ABRE MODAL ===
          console.log('Abrindo modal Bootstrap...');
          this.abrirModalBootstrap();
        },
        error: (err) => {
          console.error('ERRO getById:', err);
          this.toast.error('Erro ao carregar inquérito.');
        }
      });
    } else {
      console.log('MODO: CRIAÇÃO');
      this.isEdicao.set(false);
      this.inqueritoForm.patchValue({ delegaciaId: this.delegaciaId() });
      console.log('Formulário limpo com delegaciaId:', this.inqueritoForm.getRawValue());
      this.abrirModalBootstrap();
    }

    console.log('=== FIM abrirModal ===');
  }

  private abrirModalBootstrap(): void {
    const modalElement = document.getElementById('formModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private carregarDetalhesPessoas(pessoaIds: number[]): void {
    if (pessoaIds.length === 0) {
      this.pessoaMap.clear();
      return;
    }

    this.pessoaService.getByIds(pessoaIds).subscribe({
      next: (pessoas) => {
        this.pessoaMap.clear();
        pessoas.forEach(p => this.pessoaMap.set(p.id!, p));
      },
      error: () => this.toast.error('Erro ao carregar detalhes das pessoas.')
    });
  }

  private carregarDetalhesBens(bemIds: number[]): void {
    if (bemIds.length === 0) {
      this.bemMap.clear();
      return;
    }

    this.bemService.getByIds(bemIds).subscribe({
      next: (bens) => {
        this.bemMap.clear();
        bens.forEach(b => this.bemMap.set(b.id!, b));
      }
    });
  }

  private resetar(): void {
    this.inqueritoForm.reset();
    this.pessoasArray().clear();
    this.bensArray().clear();
    this.isEdicao.set(false);
    this.filtros.set({ nome: '', cpf: '', sexo: '' });
  }

  getPessoaNome(pessoaId: number): string {
    const pessoa = this.pessoaMap.get(pessoaId) || this.pessoasFiltradas().find(p => p.id === pessoaId);
    return pessoa?.nome || '—';
  }

  getBemDescricao(bemId: number): string {
    const bem = this.bemMap.get(bemId) || this.bensFiltrados().find(b => b.id === bemId);
    if (!bem) return '—';
    return `${bem.descricao} (${bem.marca} ${bem.modelo})`.trim();
  }

  getDescricaoPeca = (peca: string) => PecaDescricao[peca as Peca] || peca;
  getDescricaoSituacao = (situacao: string) => SituacaoInqueritoDescricao[situacao as SituacaoInquerito] || situacao;
  getDescricaoGenero = (sexo: string) => GeneroDescricao[sexo as Genero] || sexo;
  getDescricaoTipoEnvolvimento = (tipo: string) => TipoEnvolvimentoDescricao[tipo as TipoEnvolvimento] || tipo;
  getBemTipoEnvolvimentoDescricao = (tipoEnvolvimento: string) => BemTipoEnvolvimentoDescricao[tipoEnvolvimento as BemTipoEnvolvimento] || tipoEnvolvimento;
}