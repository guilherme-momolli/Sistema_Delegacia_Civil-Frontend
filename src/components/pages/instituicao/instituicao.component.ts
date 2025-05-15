import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstituicaoService } from '../../../core/service/instituicao/instituicao.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Pais, UF } from './instituicao.enum';

@Component({
  selector: 'app-instituicao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './instituicao.component.html',
  styleUrl: './instituicao.component.css'
})
export class InstituicaoComponent {
  paises = Object.values(Pais);
  ufs = Object.values(UF);

  instituicaoForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private instituicaoService: InstituicaoService,
    private router: Router
  ) {
    this.instituicaoForm = this.fb.group({
      secretaria: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefoneFixo: ['', Validators.required],
      telefoneCelular: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      municipio: ['', Validators.required],
      uf: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.instituicaoForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  submitForm(): void {
    if (this.instituicaoForm.invalid) {
      this.instituicaoForm.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;
  
    const formValue = this.instituicaoForm.value;
    const senha = formValue.senha;
  
    const instituicaoPayload = {
      secretaria: formValue.secretaria,
      nomeFantasia: formValue.nomeFantasia,
      email: formValue.email,
      telefoneFixo: formValue.telefoneFixo,
      telefoneCelular: formValue.telefoneCelular,
      endereco: {
        logradouro: formValue.logradouro,
        numero: formValue.numero,
        bairro: formValue.bairro,
        cep: formValue.cep,
        municipio: formValue.municipio,
        uf: formValue.uf,
        pais: formValue.pais
      }
    };
  
    this.instituicaoService.createInstituicao(instituicaoPayload, senha).subscribe({
      next: () => {
        this.successMessage = 'Instituição cadastrada com sucesso!';
        this.instituicaoForm.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Erro ao cadastrar instituição.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  
}
