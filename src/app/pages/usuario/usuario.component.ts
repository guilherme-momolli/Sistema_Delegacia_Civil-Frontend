
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CadastroUsuarioRequest, User, UsuarioService } from '../../core/service/usuario/usuario.service';
import { AuthService } from '../../core/guards/auth/auth.service';
import { Privilegio } from '../../core/enum/usuario/privilegio.enum'; 

declare var bootstrap: any;

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  successMessage: string = '';
  errorMessage: string = '';
  usuarioForm: FormGroup;
  usuarios: User[] = [];
  usuarioSelecionado: User | null = null;
  isEdicao: boolean = false;
  modalExclusaoAberto: boolean = false;
  imagemPreview: string | ArrayBuffer | null = null;
  imagemSelecionada?: File;
  privilegios = Object.values(Privilegio);
  delegaciaId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.usuarioForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      delegaciaId: [this.delegaciaId, [Validators.required]],
      privilegio: [Privilegio.USUARIO, Validators.required],
    });

  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.delegaciaId = this.authService.getDelegaciaId();
    console.log('Delegacia ID:', this.delegaciaId);

    this.usuarioForm.patchValue({ delegaciaId: this.delegaciaId });

    if (this.delegaciaId) {
      this.carregarUsuarios(this.delegaciaId);
    }
  }
  carregarUsuarios(delegaciaId: number): void {
    this.usuarioService.getUsuarioByDelegacia(delegaciaId).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar usuários: ' + error.message;
      }
    });
  }

  salvarUsuario(): void {
    const formValue = this.usuarioForm.value;

    const usuario: CadastroUsuarioRequest = {
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      privilegio: formValue.privilegio,
      delegaciaId: this.delegaciaId!
    };

    if (this.isEdicao && formValue.id) {
      const usuarioAtualizar: User = {
        id: formValue.id,
        nome: formValue.nome,
        email: formValue.email,
        senha: formValue.senha,
        privilegio: formValue.privilegio,
        delegacia: { id: this.delegaciaId! }
      };

      this.usuarioService.updateUsuario(usuarioAtualizar.id, usuarioAtualizar).subscribe({
        next: () => {
          this.successMessage = 'Usuário atualizado com sucesso!';
          this.carregarUsuarios(this.delegaciaId!);
          this.resetarFormulario();
        },
        error: (error) => this.errorMessage = 'Erro ao atualizar usuário: ' + error.message
      });
    } else {
      this.usuarioService.createUsuario(usuario).subscribe({
        next: () => {
          this.successMessage = 'Usuário criado com sucesso!';
          this.carregarUsuarios(this.delegaciaId!);
          this.resetarFormulario();
        },
        error: (error) => this.errorMessage = 'Erro ao criar usuário: ' + error.message
      });
    }
  }


  abrirModalEdicao(usuario?: User): void {
    this.isEdicao = true;
    this.usuarioForm.patchValue({
      id: usuario?.id || null,
      nome: usuario?.nome || '',
      email: usuario?.email || '',
      senha: '',
      privilegio: usuario?.privilegio || Privilegio.USUARIO,
      delegaciaId: this.delegaciaId
    });
  }

  confirmarExclusao(usuario: User): void {
    this.modalExclusaoAberto = true;
    this.usuarioSelecionado = usuario;
  }

  fecharModalExclusao(): void {
    this.modalExclusaoAberto = false;
    this.usuarioSelecionado = null;
  }

  excluirDelegacia(): void {
    if (this.usuarioSelecionado?.id) {
      this.usuarioService.deleteUsuario(this.usuarioSelecionado.id).subscribe({
        next: () => {
          this.carregarUsuarios(this.delegaciaId!);
          this.fecharModalExclusao();
          alert('Delegacia excluída com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  public resetarFormulario(): void {
    this.usuarioForm.reset();
    this.imagemSelecionada = undefined;
    this.isEdicao = false;
  }
}