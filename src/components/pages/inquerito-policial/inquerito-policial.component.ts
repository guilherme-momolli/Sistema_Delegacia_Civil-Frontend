import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { InqueritoPolicial, InqueritoPolicialService } from '../../../core/service/inquerito-policial/inquerito-policial.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { RelatorioService } from '../../../core/service/relatorio/relatorio.service';
import { Origem, Peca, Situacao, TipoArmaFogo, TipoDroga, UnidadeMedida } from './enum';

declare var bootstrap: any;

@Component({
  selector: 'app-inquerito-policial',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './inquerito-policial.component.html',
  styleUrls: ['./inquerito-policial.component.css']
})
export class InqueritoPolicialComponent implements OnInit, AfterViewInit {
  inqueritoForm: FormGroup;
  inqueritoSelecionado?: InqueritoPolicial;
  inqueritos: InqueritoPolicial[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  instituicaoId: number | null = null;


  @ViewChild('inqueritoCreateModal') inqueritoCreateModal!: ElementRef;
  private modalCreateInstance: any;

  @ViewChild('inqueritoEditModal') inqueritoEditModal!: ElementRef;
  private modalEditInstance: any;

  pecas = Object.values(Peca);
  situacoes = Object.values(Situacao);
  tipoArmaFogos = Object.values(TipoArmaFogo);
  tipoDrogas = Object.values(TipoDroga);
  unidadeMedida = Object.values(UnidadeMedida);
  origens = Object.values(Origem)

  page = 1;
  pageSize = 20;


  constructor(
    private fb: FormBuilder,
    private inqueritoService: InqueritoPolicialService,
    private router: Router,
    private authService: AuthService,
    private relatorioService: RelatorioService
  ) {
    this.inqueritoForm = this.fb.group({
      id: [null],
      numeroJustica: ['', Validators.required],
      ordemIp: ['', Validators.required],
      data: ['', Validators.required],
      peca: ['', Validators.required],
      relator: ['', Validators.required],
      origemForcaPolicial: ['', Validators.required],
      investigado: ['', Validators.required],
      vitima: ['', Validators.required],
      naturezaDoDelito: ['', Validators.required],
      armas: this.fb.array([]),
      drogas: this.fb.array([]),
      observacao: [''],
      situacao: [''],
    });
  }

  get armas() {
    return this.inqueritoForm.get('armas') as FormArray;
  }

  get drogas() {
    return this.inqueritoForm.get('drogas') as FormArray;
  }

  ngOnInit(): void {
    this.instituicaoId = this.authService.getInstituicaoId();
    if (!this.instituicaoId) {
      console.warn('ID da instituição não encontrado.');
      return;
    }
    this.carregarInqueritos();
  }

  ngAfterViewInit(): void {
    if (this.inqueritoCreateModal?.nativeElement) {
      this.modalCreateInstance = bootstrap.Modal.getOrCreateInstance(this.inqueritoCreateModal.nativeElement);
    }

    if (this.inqueritoEditModal?.nativeElement) {
      this.modalEditInstance = bootstrap.Modal.getOrCreateInstance(this.inqueritoEditModal.nativeElement);
    }
  }

  carregarInqueritos(): void {
    const instituicaoId = this.authService.getInstituicaoId();
    if (!instituicaoId) {
      console.warn('ID da instituição não encontrado. Usuário não autenticado.');
      return;
    }

    this.inqueritoService.getInqueritosByInstituicao(instituicaoId).subscribe({
      next: (data) => this.inqueritos = data,
      error: (err) => console.error('Erro ao carregar inquéritos', err)
    });
  }

  private criarArmaForm(): FormGroup {
    return this.fb.group({
      tipoArmaFogo: ['', Validators.required],
      especie: [''],
      marca: [''],
      calibre: ['', Validators.required],
      numeroPorte: [''],
      numeroSerie: ['', Validators.required],
      numeroRegistro: [''],
      capacidade: [0],
      quantidade: [0],
      numeroLacre: [''],
      valor: [0],
      localArma: [''],
      situacao: ['']
    });
  }


  private criarDrogaForm(): FormGroup {
    return this.fb.group({
      tipoDroga: ['', Validators.required],
      nomePopular: [''],
      unidadeMedida: [''],
      quantidade: [0, Validators.required],
      quantidadePericia: [0],
      quantidadePorExtenso: [''],
      observacao: [''],
      numeroLacre: [''],
      localDroga: [''],
      situacao: ['']
    });
  }

  addDroga() {
    this.drogas.push(this.criarDrogaForm());
  }

  addArma() {
    this.armas.push(this.criarArmaForm());
  }

  removeArma(index: number) {
    this.armas.removeAt(index);
  }

  removeDroga(index: number) {
    this.drogas.removeAt(index);
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.inqueritoForm.invalid || this.isSubmitting) {
      console.warn('Formulário inválido ou já em submissão');
      return;
    }

    const instituicaoId = this.authService.getInstituicaoId();
    if (!instituicaoId) {
      this.errorMessage = 'Instituição não identificada!';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const inqueritoData: InqueritoPolicial = {
      ...this.inqueritoForm.value,
      instituicao: { id: instituicaoId }
    };

    this.inqueritoService.createInquerito(inqueritoData).subscribe({
      next: (novoInquerito) => {
        this.inqueritos.push(novoInquerito);
        this.successMessage = 'Inquérito cadastrado com sucesso!';
        this.resetForm();
        this.modalCreateInstance.hide();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erro ao cadastrar inquérito', err);
        this.errorMessage = err?.error?.message || 'Erro ao cadastrar inquérito!';
        this.isSubmitting = false;
      }
    });
  }


  editarInquerito(id: number): void {
    this.inqueritoService.getInqueritoById(id).subscribe({
      next: (inq) => {
        this.inqueritoSelecionado = inq;
        this.inqueritoForm.patchValue(inq);
        this.modalEditInstance.show();
      },
      error: (err) => console.error('Erro ao buscar inquérito', err)
    });
  }

  salvarEdicao(): void {
    if (this.inqueritoForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const id = this.inqueritoForm.value.id;
    const inqueritoData: InqueritoPolicial = this.inqueritoForm.value;

    this.inqueritoService.updateInquerito(id, inqueritoData).subscribe({
      next: (atualizado) => {
        const index = this.inqueritos.findIndex(i => i.id === id);
        if (index >= 0) this.inqueritos[index] = atualizado;
        this.successMessage = 'Inquérito atualizado com sucesso!';
        this.modalEditInstance.hide();
        this.resetForm();
      },
      error: (err) => {
        console.error('Erro ao atualizar inquérito', err);
        this.errorMessage = 'Erro ao atualizar inquérito!';
      },
      complete: () => this.isSubmitting = false
    });
  }

  deletarInquerito(id?: number): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este inquérito?')) {
      this.inqueritoService.deleteInquerito(id).subscribe({
        next: () => {
          this.inqueritos = this.inqueritos.filter(i => i.id !== id);
          this.successMessage = 'Inquérito excluído com sucesso!';
          this.modalEditInstance.hide();
        },
        error: (err) => {
          console.error('Erro ao deletar inquérito', err);
          this.errorMessage = 'Erro ao deletar inquérito!';
        }
      });
    }
  }

  abrirModal(): void {
    this.resetForm();
    this.modalCreateInstance.show();
  }

  cancelarEdicao(): void {
    this.resetForm();
    this.modalEditInstance.hide();
    console.log('Edição cancelada');
  }

  verMais(id: number): void {
    this.editarInquerito(id);
  }

  resetForm(): void {
    this.inqueritoForm.reset();
    this.armas.clear();
    this.drogas.clear();
  }

  gerarRelatorio(): void {
    this.relatorioService.gerarRelatorioInqueritos(this.inqueritos);
  }

}
