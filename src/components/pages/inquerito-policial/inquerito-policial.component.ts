import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Arma, Droga, InqueritoPolicial, InqueritoPolicialService } from '../../../core/service/inquerito-policial/inquerito-policial.service';
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
  modoEdicao = false;
  editandoInqueritoId: number | null = null;

  private backupInquerito: any;

  @ViewChild('inqueritoCreateModal') inqueritoCreateModal!: ElementRef;
  private modalCreateInstance: any;

  @ViewChild('inqueritoEditModal') inqueritoEditModal!: ElementRef;
  private modalEditInstance: any;

  pecas = Object.values(Peca);
  situacoes = Object.values(Situacao);
  tipoArmaFogos = Object.values(TipoArmaFogo);
  tipoDrogas = Object.values(TipoDroga);
  unidadeMedida = Object.values(UnidadeMedida);
  origens = Object.values(Origem);

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

  private criarArmaFormGroup(arma?: Arma): FormGroup {
    return this.fb.group({
      tipoArmaFogo: [arma?.tipoArmaFogo || '', Validators.required],
      especie: [arma?.especie || ''],
      marca: [arma?.marca || ''],
      calibre: [arma?.calibre || ''],
      numeroPorte: [arma?.numeroPorte || ''],
      numeroSerie: [arma?.numeroSerie || ''],
      numeroRegistro: [arma?.numeroRegistro || ''],
      capacidade: [arma?.capacidade || 0],
      quantidade: [arma?.quantidade || 0],
      numeroLacre: [arma?.numeroLacre || ''],
      valor: [arma?.valor || 0],
      localArma: [arma?.localArma || ''],
    });
  }

  private criarDrogaFormGroup(droga?: Droga): FormGroup {
    return this.fb.group({
      tipoDroga: [droga?.tipoDroga || '', Validators.required],
      nomePopular: [droga?.nomePopular || '', Validators.required],
      unidadeMedida: [droga?.unidadeMedida || '', Validators.required],
      quantidade: [droga?.quantidade || '', Validators.required],
      quantidadePericia: [droga?.quantidadePericia || '', Validators.required],
      quantidadePorExtenso: [droga?.quantidadePorExtenso || '', Validators.required],
      observacao: [droga?.observacao || '', Validators.required],
      numeroLacre: [droga?.numeroLacre || '', Validators.required],
      localDroga: [droga?.localDroga || '', Validators.required],
    });
  }
  get armas() {
    return this.inqueritoForm.get('armas') as FormArray;
  }

  get drogas() {
    return this.inqueritoForm.get('drogas') as FormArray;
  }

  salvarArquivo(blob: Blob, nomeArquivo: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

    console.log('ngAfterViewInit executado');

    if (this.inqueritoCreateModal?.nativeElement) {
      this.modalCreateInstance = new bootstrap.Modal(this.inqueritoCreateModal.nativeElement);
    }

    if (this.inqueritoEditModal?.nativeElement) {
      this.modalEditInstance = new bootstrap.Modal(this.inqueritoEditModal.nativeElement);
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

  addDroga(droga?: Droga) {
    this.drogas.push(this.fb.group({
      tipoDroga: [droga?.tipoDroga || '', Validators.required],
      nomePopular: [droga?.nomePopular || '', Validators.required],
      unidadeMedida: [droga?.unidadeMedida || '', Validators.required],
      quantidade: [droga?.quantidade || '', Validators.required],
      quantidadePericia: [droga?.quantidadePericia || '', Validators.required],
      quantidadePorExtenso: [droga?.quantidadePorExtenso || '', Validators.required],
      observacao: [droga?.observacao || '', Validators.required],
      numeroLacre: [droga?.numeroLacre || '', Validators.required],
      localDroga: [droga?.localDroga || '', Validators.required],
    }));
  }

  addArma(arma?: Arma) {
    this.armas.push(this.fb.group({
      tipoArmaFogo: [arma?.tipoArmaFogo || '', Validators.required],
      especie: [arma?.especie || ''],
      marca: [arma?.marca || ''],
      calibre: [arma?.calibre || ''],
      numeroPorte: [arma?.numeroPorte || ''],
      numeroSerie: [arma?.numeroSerie || ''],
      numeroRegistro: [arma?.numeroRegistro || ''],
      capacidade: [arma?.capacidade || 0],
      quantidade: [arma?.quantidade || 0],
      numeroLacre: [arma?.numeroLacre || ''],
      valor: [arma?.valor || 0],
      localArma: [arma?.localArma || ''],
    }));
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
        console.log('Inquérito carregado:', inq);
        this.inqueritoSelecionado = inq;

        const dataFormatada = inq.data ? this.formatDate(inq.data) : null;

        this.armas.clear();
        this.drogas.clear();

        console.log('Limpando armas e drogas antes de popular');

        if (inq.armas && inq.armas.length > 0) {
          console.log('Armas encontradas:', inq.armas);
          inq.armas.forEach((arma: any) => this.armas.push(this.criarArmaFormGroup(arma)));
        } else {
          console.log('Nenhuma arma encontrada no inquérito.');
        }

        if (inq.drogas && inq.drogas.length > 0) {
          console.log('Drogas encontradas:', inq.drogas);
          inq.drogas.forEach((droga: any) => this.drogas.push(this.criarDrogaFormGroup(droga)));
        } else {
          console.log('Nenhuma droga encontrada no inquérito.');
        }

        this.inqueritoForm.patchValue({
          ...inq,
          data: dataFormatada
        });

        if (!this.modalEditInstance && this.inqueritoEditModal?.nativeElement) {
          this.modalEditInstance = new bootstrap.Modal(this.inqueritoEditModal.nativeElement);
        }

        if (this.modalEditInstance) {
          this.modalEditInstance.show();
        } else {
          console.warn('modalEditInstance ainda está indefinido');
        }
      },
      error: (err) => console.error('Erro ao buscar inquérito', err)
    });
  }




  abrirModal(): void {
    this.resetForm();
    this.modalCreateInstance.show();
  }

  deletarInquerito(id?: number | undefined): void {
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

  resetForm(): void {
    this.inqueritoForm.reset();
    this.armas.clear();
    this.drogas.clear();
    this.inqueritoForm.enable();
  }

  gerarRelatorio(): void {
    this.relatorioService.gerarRelatorioInqueritos(this.inqueritos);
  }

  gerarRelatorioIndividual(inqueritoId: number | null): void {
    this.relatorioService.gerarRelatorioIndividual(inqueritoId);
  }

  habilitarEdicao() {
    this.modoEdicao = true;
    this.inqueritoForm.enable();
  }

  cancelarEdicao() {
    this.modoEdicao = false;
    if (this.inqueritoSelecionado) {
      this.editarInquerito(this.inqueritoSelecionado.id!);
    } else {
      this.resetForm();
      this.modalEditInstance.hide();
    }
  }

  salvarEdicao() {
    if (this.inqueritoForm.invalid || !this.inqueritoSelecionado?.id) return;

    const dadosAtualizados: InqueritoPolicial = {
      ...this.inqueritoForm.value,
      id: this.inqueritoSelecionado.id,
      instituicao: { id: this.instituicaoId! }
    };

    this.inqueritoService.updateInquerito(dadosAtualizados.id!, dadosAtualizados).subscribe({
      next: (atualizado) => {
        const index = this.inqueritos.findIndex(i => i.id === atualizado.id);
        if (index !== -1) {
          this.inqueritos[index] = atualizado;
        }
        this.successMessage = 'Inquérito atualizado com sucesso!';
        this.modoEdicao = false;
        this.inqueritoForm.disable();
        this.modalEditInstance.hide();
      },
      error: (err) => {
        console.error('Erro ao atualizar inquérito', err);
        this.errorMessage = 'Erro ao atualizar inquérito!';
      }
    });
  }

  fecharModal() {
    this.resetForm();
    this.inqueritoSelecionado = undefined;
    this.backupInquerito = null;
    this.modoEdicao = false;
    this.modalEditInstance.hide();
  }

  verMais(inqueritoId: number): void {
    this.editandoInqueritoId = inqueritoId;
    this.editarInquerito(inqueritoId);
  }


  baixarTodos() {
    this.inqueritoService.downloadExcelAll().subscribe(blob => {
      this.salvarArquivo(blob, 'inqueritos.xlsx');
    });
  }

  baixarPorInstituicao() {
    const instituicaoId = this.authService.getInstituicaoId();
    if (!instituicaoId) {
      console.error('Instituição não encontrada para o usuário logado');
      return;
    }
    this.inqueritoService.downloadExcelByInstituicao(instituicaoId).subscribe({
      next: (blob) => this.salvarArquivo(blob, `inqueritos_instituicao_${instituicaoId}.xlsx`),
      error: (err) => console.error('Erro ao baixar arquivo', err)
    });
  }


  private formatDate(data: string | Date): string {
    const date = new Date(data);
    return date.toISOString().split('T')[0];
  }
}
