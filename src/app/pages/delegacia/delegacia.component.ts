import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Delegacia, DelegaciaService } from '../../core/service/delegacia/delegacia.service';
import { Pais, UF } from '../../../shared/enums/index.enum';
import { RouterModule } from '@angular/router';
import { EnderecoService } from '../../core/service/endereco/endereco.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { FileService } from '../../core/service/file/file.service';

@Component({
  selector: 'app-delegacia',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './delegacia.component.html',
  styleUrls: ['./delegacia.component.css']
})
export class DelegaciaComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  delegaciaForm: FormGroup;
  paises = Object.values(Pais);
  ufMap = UF;
  ufSiglas = Object.keys(UF) as (keyof typeof UF)[];
  ufs = Object.entries(UF).map(([sigla, nome]) => ({ sigla, nome }));
  delegacias: Delegacia[] = [];
  delegaciaSelecionada: Delegacia | null = null;
  imagemSelecionada?: File;
  isEdicao: boolean = false;
  modalExclusaoAberto: boolean = false;
  imagemPreview: string | ArrayBuffer | null = null;


  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private delegaciaService: DelegaciaService,
    public fileService: FileService
  ) {
    this.delegaciaForm = this.fb.group({
      id: [null],
      imagemUrl: [''],
      secretaria: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefoneFixo: [''],
      telefoneCelular: [''],
      senha: [''],
      enderecoForm: this.fb.group({
        id: [''],
        pais: ['BRASIL', Validators.required],
        uf: ['', Validators.required],
        municipio: ['', Validators.required],
        bairro: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        cep: ['', [Validators.required, Validators.pattern('^[0-9]{5}-[0-9]{3}$')]]
      })
    });
  }

  getUfName(sigla: keyof typeof UF): string {
    return UF[sigla];
  }

  ngOnInit(): void {
    this.carregarDelegacias();

    this.delegaciaForm.get('enderecoForm.cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(cep => cep && cep.replace(/\D/g, '').length === 8)
      )
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        this.enderecoService.getEnderecoByCep(cepLimpo).subscribe({
          next: (data) => {
            const enderecoForm = this.delegaciaForm.get('enderecoForm');
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

  carregarDelegacias(): void {
    this.delegaciaService.getDelegacias().subscribe({
      next: (data) => {
        console.log('Delegacias carregadas:', data);
        this.delegacias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar delegacias:', err);
        alert(err.message);
      }
    });
  }

  getImagemDelegacia(delegacia: Delegacia): string {
    if (!delegacia.imagemUrl) return '';
    return this.fileService.getImageUrl('Delegacia', delegacia.imagemUrl);
  }

  onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.imagemSelecionada = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagemPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


  salvarDelegacia(): void {
    const formValue = this.delegaciaForm.value;

    const delegacia: Delegacia = {
      secretaria: formValue.secretaria,
      nome: formValue.nome,
      email: formValue.email,
      telefoneFixo: formValue.telefoneFixo,
      telefoneCelular: formValue.telefoneCelular,
      endereco: {
        id: formValue.enderecoForm.id,
        pais: formValue.enderecoForm.pais,
        uf: formValue.enderecoForm.uf,
        municipio: formValue.enderecoForm.municipio,
        bairro: formValue.enderecoForm.bairro,
        logradouro: formValue.enderecoForm.logradouro,
        numero: formValue.enderecoForm.numero,
        cep: formValue.enderecoForm.cep
      }
    };

    const senha = formValue.senha;

    if (this.isEdicao && formValue.id) {
      this.delegaciaService.updateDelegacia(formValue.id, delegacia, senha, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarDelegacias();
          this.resetarFormulario();
          alert('Delegacia atualizada com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    } else {
      this.delegaciaService.createDelegacia(delegacia, senha, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarDelegacias();
          this.resetarFormulario();
          alert('Delegacia criada com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  abrirModalEdicao(delegacia: Delegacia): void {
    this.isEdicao = true;
    this.delegaciaForm.patchValue({
      id: delegacia.id,
      secretaria: delegacia.secretaria,
      nome: delegacia.nome,
      email: delegacia.email,
      telefoneFixo: delegacia.telefoneFixo,
      telefoneCelular: delegacia.telefoneCelular,
      senha: '',
      enderecoForm: {
        id: delegacia.endereco?.id || '',
        pais: delegacia.endereco?.pais || 'BRASIL',
        uf: delegacia.endereco?.uf || '',
        municipio: delegacia.endereco?.municipio || '',
        bairro: delegacia.endereco?.bairro || '',
        logradouro: delegacia.endereco?.logradouro || '',
        numero: delegacia.endereco?.numero || '',
        cep: delegacia.endereco?.cep || ''
      }
    });
  }

  confirmarExclusao(delegacia: Delegacia): void {
    this.modalExclusaoAberto = true;
    this.delegaciaSelecionada = delegacia;
  }

  fecharModalExclusao(): void {
    this.modalExclusaoAberto = false;
    this.delegaciaSelecionada = null;
  }

  excluirDelegacia(): void {
    if (this.delegaciaSelecionada?.id) {
      this.delegaciaService.deleteDelgacia(this.delegaciaSelecionada.id).subscribe({
        next: () => {
          this.carregarDelegacias();
          this.fecharModalExclusao();
          alert('Delegacia excluída com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  public resetarFormulario(): void {
    this.delegaciaForm.reset();
    this.delegaciaForm.get('enderecoForm')?.reset({ pais: 'BRASIL' });
    this.imagemSelecionada = undefined;
    this.isEdicao = false;
  }
}
