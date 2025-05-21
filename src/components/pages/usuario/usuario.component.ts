import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { User, UsuarioService } from '../../../core/service/usuario/usuario.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { Privilegio } from './privilegio.enum';

declare var bootstrap: any;

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  usuarioForm: FormGroup;
  usuarios: User[] = [];
  usuarioSelecionado?: User;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  modoEdicaoAtivado: boolean = false;
  editandoUsuarioId: number | null = null;

  @ViewChild('usuarioCreateModal') usuarioCreateModal!: ElementRef;
  private modalCreateInstance: any;

  @ViewChild('usuarioEditModal') usuarioEditModal!: ElementRef;
  private modalEditInstance: any;

  privilegioList = Object.values(Privilegio);

  page = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      instituicaoId: [''],
      privilegio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  ngAfterViewInit(): void {
    if (this.usuarioCreateModal) {
      this.modalCreateInstance = new bootstrap.Modal(this.usuarioCreateModal.nativeElement);
    }
    if (this.usuarioEditModal) {
      this.modalEditInstance = new bootstrap.Modal(this.usuarioEditModal.nativeElement);
    }
  }

  carregarUsuarios(): void {
    const instituicaoId = this.authService.getInstituicaoId();

    if (!instituicaoId) {
      console.warn('ID da instituição não encontrado. Usuário pode não estar autenticado.');
      return;
    }

    this.usuarioService.getUsuarioByInstituicao(instituicaoId).subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários da instituição:', error);
      }
    });
  }

  abrirModal(): void {
    this.resetForm();
    this.successMessage = null;
    this.errorMessage = null;
    this.modalCreateInstance.show();
  }


  editarUsuario(usuarioId: number): void {
    this.successMessage = null;
    this.errorMessage = null;

    this.usuarioService.getUsuarioById(usuarioId).subscribe((usuario) => {
      this.usuarioSelecionado = usuario;
      this.usuarioForm.patchValue(usuario);
      this.modalEditInstance.show();
    });
  }

  salvarEdicao(): void {
    if (this.usuarioForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const id = this.usuarioForm.value.id;
    if (!id) return;

    // Copia o valor do formulário
    const usuarioData: any = { ...this.usuarioForm.value };

    // Se a senha estiver vazia, remove do objeto para não atualizar
    if (!usuarioData.senha) {
      delete usuarioData.senha;
    }

    this.usuarioService.updateUsuario(id, usuarioData).subscribe({
      next: (usuarioAtualizado) => {
        console.log('Usuário atualizado com sucesso', usuarioAtualizado);
        this.carregarUsuarios();
        this.successMessage = 'Usuário atualizado com sucesso!';
      },
      error: (erro) => {
        console.error('Erro ao atualizar usuário:', erro);
        this.errorMessage = 'Erro ao atualizar usuário!';
      },
      complete: () => {
        this.isSubmitting = false;
        this.modalEditInstance.hide();
        this.resetForm();
      }
    });
  }


  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.usuarioForm.invalid || this.isSubmitting) {
      console.warn('Formulário inválido ou já em submissão');
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const usuarioData: User = {
      ...this.usuarioForm.value,
      instituicaoId: this.authService.getInstituicaoId()
    };

    this.usuarioService.createUsuario(usuarioData).subscribe({
      next: (usuarioCriado) => {
        console.log('Usuário cadastrado com sucesso!', usuarioCriado);
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.usuarios.push(usuarioCriado);
        this.resetForm();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar usuário!', erro);
        this.errorMessage = 'Erro ao cadastrar usuário!';
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  deletarUsuario(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID inválido: undefined');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          this.modalEditInstance.hide();
        },
        (error) => {
          console.error('Erro ao deletar Usuario', error);
        }
      );
    }
  }

  cancelarEdicao(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.usuarioForm.reset();
    this.modalEditInstance.hide();
  }

  resetForm(): void {
    this.usuarioForm.reset();
  }

  habilitarEdicao(): void {
    this.modoEdicaoAtivado = true;
  }

  verMais(usuarioId: number): void {
    this.editandoUsuarioId = usuarioId;
    this.editarUsuario(usuarioId);
  }
}
