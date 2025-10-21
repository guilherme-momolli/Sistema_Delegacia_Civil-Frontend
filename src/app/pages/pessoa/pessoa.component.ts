import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, identity } from 'rxjs';
import { Pessoa } from '../../core/service/pessoa/pessoa.service';
import { PessoaService } from '../../core/service/pessoa/pessoa.service';
import { EnderecoService } from '../../core/service/endereco/endereco.service';
import { FileService } from '../../core/service/file/file.service';
import { Genero, SituacaoPessoa, Cargo, EstadoCivil, UF, Etnia, Pais, UFDescricao, GeneroDescricao, EtniaDescricao, SituacaoPessoaDescricao, EstadoCivilDescricao, CargoDescricao } from '../../../shared/enums/index.enum'
import { enumToKeyValueArray } from '../../../shared/enums/enum-utils';
import e from 'express';
import { PessoaResponseDTO } from '../../core/models/dto/pessoa/pessoa-response.dto';
import { PessoaRequestDTO } from '../../core/models/dto/pessoa/pessoa-request.dto';
import { StorageService } from '../../core/service/storage/storage.service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css']
})
export class PessoaComponent implements OnInit {
  pessoas: PessoaResponseDTO[] = [];
  pessoaSelecionada?: PessoaResponseDTO;

  formPessoa: FormGroup;
  editando = false;
  modalAberto = false;

  imagemSelecionada?: File;
  imagemPreview: string | ArrayBuffer | null = null;

  successMessage = '';
  errorMessage = '';

  paises = enumToKeyValueArray(Pais);
  ufSiglas = enumToKeyValueArray(UF, UFDescricao);
  generos = enumToKeyValueArray(Genero, GeneroDescricao);
  etnias = enumToKeyValueArray(Etnia, EtniaDescricao);
  situacoesPessoa = enumToKeyValueArray(SituacaoPessoa, SituacaoPessoaDescricao);
  estadosCivis = enumToKeyValueArray(EstadoCivil, EstadoCivilDescricao);
  cargos = enumToKeyValueArray(Cargo, CargoDescricao);

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private enderecoService: EnderecoService,
    public fileService: FileService
  ) {
    this.formPessoa = this.fb.group({
      id: [''],
      imagemUrl: [''],
      nome: ['', Validators.required],
      nomeSocial: [''],
      cpf: [''],
      rg: [''],
      dataNascimento: [''],
      sexo: [''],
      telefoneCelular: [''],
      telefoneFixo: [''],
      email: ['', Validators.email],
      estadoCivil: [''],
      profissao: [''],
      nacionalidade: [''],
      naturalidade: [''],
      certificadoRegistro: [''],
      etnia: [''],
      situacaoPessoa: [''],
      descricao: [''],
      endereco: this.fb.group({
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

  ngOnInit(): void {
    this.carregarPessoas();

    this.formPessoa.get('endereco.cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(cep => cep && cep.replace(/\D/g, '').length === 8)
      )
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        this.enderecoService.getEnderecoByCep(cepLimpo).subscribe({
          next: (data) => this.formPessoa.get('endereco')?.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            municipio: data.localidade,
            uf: data.uf,
            pais: 'BRASIL'
          }),
          error: (err) => console.error('Erro ao buscar CEP', err)
        });
      });
  }

  carregarPessoas(): void {
    this.pessoaService.getPessoas().subscribe({
      next: data => this.pessoas = data,
      error: err => alert(err.message)
    });
  }

  resetarFormulario(): void {
    this.editando = false;
    this.formPessoa.reset({ endereco: { pais: 'BRASIL' } });
    this.imagemSelecionada = undefined;
    this.imagemPreview = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  abrirModalEdicao(pessoa: PessoaResponseDTO): void {
    this.editando = true;
    this.pessoaSelecionada = pessoa;
    this.formPessoa.patchValue({
      ...pessoa,
      endereco: pessoa.endereco || { pais: 'BRASIL' }
    });
    this.imagemPreview = pessoa.imagemUrl ? this.fileService.getImageUrl('Pessoa', pessoa.imagemUrl) : null;
    this.modalAberto = true;
  }

  trackByPessoaId(index: number, pessoa: PessoaResponseDTO): any {
    return pessoa.id;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      const reader = new FileReader();
      reader.onload = () => this.imagemPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  getUfName(sigla: string): string {
    const ufMap: any = { PR: 'Paraná', SP: 'São Paulo', RJ: 'Rio de Janeiro' };
    return ufMap[sigla] || sigla;
  }

  salvarPessoa(): void {
    const pessoa: PessoaRequestDTO = { ...this.formPessoa.value };
    console.log('📌 Dados do formulário (salvarPessoa):', pessoa, this.imagemSelecionada);

    if (this.editando && this.pessoaSelecionada?.id) {
      const pessoaAtualizada = { ...pessoa };
      delete (pessoaAtualizada as any).id; // 👈 Remove o ID antes de enviar

      this.pessoaService.updatePessoa(this.pessoaSelecionada.id, pessoaAtualizada, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarPessoas();
          this.resetarFormulario();
          this.successMessage = 'Pessoa atualizada com sucesso!';
        },
        error: err => this.errorMessage = err.message
      });
    } else {
      this.pessoaService.createPessoa(pessoa, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarPessoas();
          this.resetarFormulario();
          this.successMessage = 'Pessoa criada com sucesso!';
        },
        error: err => this.errorMessage = err.message
      });
    }
  }

  confirmarExclusao(pessoa: PessoaResponseDTO): void {
    this.pessoaSelecionada = pessoa;
    if (confirm(`Deseja realmente excluir ${pessoa.nome}?`)) {
      this.excluirPessoa();
    }
  }

  excluirPessoa(): void {
    if (this.pessoaSelecionada?.id) {
      this.pessoaService.deletePessoa(this.pessoaSelecionada.id).subscribe({
        next: () => {
          this.carregarPessoas();
          this.resetarFormulario();
          this.successMessage = 'Pessoa excluída com sucesso!';
        },
        error: err => this.errorMessage = err.message
      });
    }
  }

  getImagemPessoa(pessoa: PessoaResponseDTO): string {
    return pessoa.imagemUrl ? this.fileService.getImageUrl('Pessoas', pessoa.imagemUrl) : '';
  }
}