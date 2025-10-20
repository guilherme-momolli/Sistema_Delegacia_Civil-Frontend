import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DelegaciaService } from '../../core/service/delegacia/delegacia.service';
import { Pais, UF } from '../../../shared/enums/index.enum';
import { RouterModule } from '@angular/router';
import { EnderecoService } from '../../core/service/endereco/endereco.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { FileService } from '../../core/service/file/file.service';
import { CommonModule } from '@angular/common';
import { DelegaciaResponseDTO } from '../../core/models/dto/delegacia/delegacia-response.dto';
import { DelegaciaRequestDTO } from '../../core/models/dto/delegacia/delegacia-request.dto';

@Component({
  selector: 'app-delegacia',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
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
  delegacias: DelegaciaResponseDTO[] = [];
  delegaciaSelecionada: DelegaciaResponseDTO | null = null;
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
              pais: 'BRASIL'
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

  getImagemDelegacia(delegacia: DelegaciaResponseDTO): string {
    if (!delegacia.imagemUrl) {
      console.log('⚠️ Nenhuma imagem para esta delegacia');
      return '';
    }
    const url = this.fileService.getImageUrl('Delegacias', delegacia.imagemUrl);
    return url;
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

    const delegacia: DelegaciaRequestDTO = {
      secretaria: formValue.secretaria,
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha && formValue.senha.trim() !== '' ? formValue.senha : undefined,
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

    console.log('Dados da delegacia a serem salvos:', delegacia);


    if (this.isEdicao && formValue.id) {
      this.delegaciaService.updateDelegacia(formValue.id, delegacia, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarDelegacias();
          this.resetarFormulario();
          alert('Delegacia atualizada com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    } else {
      this.delegaciaService.createDelegacia(delegacia, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarDelegacias();
          this.resetarFormulario();
          alert('Delegacia criada com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  abrirModalEdicao(delegacia: DelegaciaResponseDTO): void {
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

  fecharModalExclusao(): void {
    this.modalExclusaoAberto = false;
    this.delegaciaSelecionada = null;
  }

  confirmarExclusao(delegacia: DelegaciaResponseDTO): void {
  console.log('Confirmar exclusão chamada', delegacia);
  this.delegaciaSelecionada = delegacia;

  const confirmacao = confirm(`Tem certeza que deseja excluir a delegacia "${delegacia.nome}"?`);
  if (confirmacao) {
    this.excluirDelegacia();
  }
}

excluirDelegacia(): void {
  console.log('Excluir delegacia chamada com ID:', this.delegaciaSelecionada?.id);

  if (this.delegaciaSelecionada?.id) {
    this.delegaciaService.deleteDelegacia(this.delegaciaSelecionada.id).subscribe({
      next: () => {
        console.log('Exclusão concluída');
        this.carregarDelegacias();
        this.fecharModalExclusao();
        alert('Delegacia excluída com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir:', err);
        alert(err.message);
      }
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
