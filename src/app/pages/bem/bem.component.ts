import { Component, OnInit } from '@angular/core';
import { BemResponseDTO } from '../../core/models/dto/bem/bem-response.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BemService } from '../../core/service/bem/bem.service';
import { BemRequestDTO } from '../../core/models/dto/bem/bem-request.dto';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileService } from '../../core/service/file/file.service';

@Component({
  selector: 'app-bem',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './bem.component.html',
  styleUrls: ['./bem.component.css']
})
export class BemComponent implements OnInit {

  bens: BemResponseDTO[] = [];
  form!: FormGroup;
  imagemSelecionada?: File;
  modalAberto = false;
  editando = false;
  bemSelecionadoId?: number;
  mensagemSucesso = '';
  mensagemErro = '';
  selectedBem: BemResponseDTO | null = null;
  showModal = false;
  isEditMode = false;
  imagemPreview: string | null = null;
  selectedFile: File | null = null;
  loading = false;
  message = '';

  constructor(
    private bemService: BemService,
    private fileService: FileService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('🟦 ngOnInit chamado');
    this.loadBens();
    this.inicializarForm();
  }

  inicializarForm(): void {
    console.log('🟩 Inicializando formulário de Bem');
    this.form = this.fb.group({
      tipoBem: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      valorEstimado: [''],
      pessoaId: [null],
      delegaciaId: [null],
      instituicaoId: [null],
      situacaoBem: [''],
      origem: [''],
      numeroLacre: [''],
      localBem: [''],
      observacao: [''],
      descricao: ['']
    });
  }

  loadBens(): void {
    console.log('🔵 Carregando lista de bens...');
    this.bemService.listarBens().subscribe({
      next: (data) => {
        console.log('✅ Bens carregados com sucesso:', data);
        this.bens = data;
      },
      error: (err) => console.error('❌ Erro ao carregar bens:', err)
    });
  }

  getImagemUrl(bem: BemResponseDTO): string {
    if (!bem.imagemUrl) return 'assets/img/placeholder.png';

    let subFolder = 'Bens';

    switch (bem.tipoBem?.toUpperCase()) {
      case 'ARMA': subFolder = 'Bens/Armas'; break;
      case 'VEICULO': subFolder = 'Bens/Veiculos'; break;
      case 'DROGA': subFolder = 'Bens/Drogas'; break;
      case 'OBJETO': subFolder = 'Bens/Objetos'; break;
      default: subFolder = 'Bens'; break;
    }

    const fullUrl = this.fileService.getImageUrl(subFolder, bem.imagemUrl);
    console.log(`🖼️ Imagem carregada para ${bem.tipoBem}:`, fullUrl);
    return fullUrl;
  }

  openModal(bem?: BemResponseDTO): void {
    console.log('📂 Abrindo modal', bem);
    this.showModal = true;
    this.isEditMode = !!bem;
    this.selectedBem = bem || null;
    this.imagemPreview = bem?.imagemUrl || null;

    if (bem) {
      console.log('✏️ Editando bem:', bem);
      this.form.patchValue(bem);
    } else {
      console.log('🆕 Criando novo bem');
      this.form.reset();
    }
  }

  closeModal(): void {
    console.log('❎ Fechando modal');
    this.showModal = false;
    this.selectedBem = null;
    this.selectedFile = null;
    this.imagemPreview = null;
    this.form.reset();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    console.log('📁 Arquivo selecionado:', file);
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemPreview = e.target.result;
        console.log('🖼️ Preview carregado');
      };
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    console.log('💾 Iniciando salvamento...');
    if (this.form.invalid) {
      console.warn('⚠️ Formulário inválido', this.form.value);
      return;
    }

    this.loading = true;
    const bem: BemRequestDTO = this.form.value;
    console.log('📦 Dados do bem a salvar:', bem);

    const uploadAndSave = (imagemUrl?: string) => {
      if (imagemUrl) bem.imagemUrl = imagemUrl;
      console.log('🚀 Salvando bem (imagemUrl:', imagemUrl, ')');

      if (this.isEditMode && this.selectedBem) {
        console.log('✏️ Atualizando bem ID:', this.selectedBem.id);
        this.bemService.atualizarBem(this.selectedBem.id, bem).subscribe({
          next: () => {
            console.log('✅ Bem atualizado com sucesso');
            this.message = 'Bem atualizado com sucesso!';
            this.loadBens();
            this.closeModal();
          },
          error: (err) => {
            console.error('❌ Erro ao atualizar bem:', err);
            this.message = 'Erro ao atualizar bem: ' + err;
          },
          complete: () => {
            console.log('🟢 Atualização finalizada');
            this.loading = false;
          }
        });
      } else {
        console.log('🆕 Criando novo bem...');
        this.bemService.cadastrarBem(bem).subscribe({
          next: () => {
            console.log('✅ Bem criado com sucesso');
            this.message = 'Bem criado com sucesso!';
            this.loadBens();
            this.closeModal();
          },
          error: (err) => {
            console.error('❌ Erro ao criar bem:', err);
            this.message = 'Erro ao criar bem: ' + err;
          },
          complete: () => {
            console.log('🟢 Criação finalizada');
            this.loading = false;
          }
        });
      }
    };

    if (this.selectedFile) {
      console.log('⬆️ Enviando arquivo antes de salvar bem...');
      this.fileService.uploadFile(this.selectedFile, 'Bens').subscribe({
        next: (res) => {
          console.log('✅ Upload concluído:', res);
          uploadAndSave(res.fileUrl);
        },
        error: (err) => {
          console.error('❌ Erro no upload de imagem:', err);
          this.loading = false;
          this.message = 'Erro ao enviar imagem: ' + err;
        }
      });
    } else {
      console.log('📎 Nenhum arquivo selecionado, salvando direto...');
      uploadAndSave();
    }
  }

  deletar(bem: BemResponseDTO): void {
    console.log('🗑️ Tentando excluir bem:', bem);
    if (confirm(`Deseja realmente excluir o bem ${bem.tipoBem}?`)) {
      this.bemService.deletarBem(bem.id).subscribe({
        next: () => {
          console.log('✅ Bem excluído com sucesso');
          this.message = 'Bem excluído com sucesso!';
          this.loadBens();
        },
        error: (err) => {
          console.error('❌ Erro ao excluir bem:', err);
          this.message = 'Erro ao excluir bem: ' + err;
        }
      });
    } else {
      console.log('❎ Exclusão cancelada pelo usuário');
    }
  }
}