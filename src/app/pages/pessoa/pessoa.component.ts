import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { Pessoa } from '../../core/service/pessoa/pessoa.service';
import { PessoaService } from '../../core/service/pessoa/pessoa.service';
import { EnderecoService } from '../../core/service/endereco/endereco.service';
import { FileService } from '../../core/service/file/file.service';
import { Genero, SituacaoPessoa, Cargo, EstadoCivil, UF, Etnia, Pais } from '../../../shared/enums/index.enum' 

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css']
})
export class PessoaComponent implements OnInit {

  successMessage: string = '';
  errorMessage: string = '';

  pessoaForm: FormGroup;
  pessoas: Pessoa[] = [];
  pessoaSelecionada: Pessoa | null = null;

  paises = Object.values(Pais);
  ufMap = UF;
  ufSiglas = Object.keys(UF) as (keyof typeof UF)[];
  generos = Object.values(Genero);
  etnias = Object.values(Etnia);
  situacoesPessoa = Object.values(SituacaoPessoa);
  estadosCivis = Object.values(EstadoCivil);
  cargos = Object.values(Cargo);
  imagemSelecionada?: File;
  imagemPreview: string | ArrayBuffer | null = null;
  isEdicao: boolean = false;
  modalExclusaoAberto: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private enderecoService: EnderecoService,
    public fileService: FileService
  ) {
    this.pessoaForm = this.fb.group({
      id: [null],
      imagemUrl: [''],
      nome: ['', Validators.required],
      nomeSocial: [''],
      dataNascimento: [''],
      sexo: [''],
      cpf: [''],
      rg: [''],
      telefoneFixo: [''],
      telefoneCelular: [''],
      email: ['', Validators.email],
      estadoCivil: [''],
      profissao: [''],
      nacionalidade: [''],
      naturalidade: [''],
      certificadoRegistro: [''],
      etnia: [''],
      situacaoPessoa: [''],
      descricao: [''],
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
    this.carregarPessoas();

    this.pessoaForm.get('enderecoForm.cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(cep => cep && cep.replace(/\D/g, '').length === 8)
      )
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        this.enderecoService.getEnderecoByCep(cepLimpo).subscribe({
          next: (data) => {
            this.pessoaForm.get('enderecoForm')?.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              municipio: data.localidade,
              uf: data.uf,
              pais: 'BRASIL'
            });
          },
          error: (err) => console.error('Erro ao buscar CEP', err)
        });
      });
  }

  carregarPessoas(): void {
    this.pessoaService.getPessoas().subscribe({
      next: (data) => this.pessoas = data,
      error: (err) => alert(err.message)
    });
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

  salvarPessoa(): void {
    const formValue = this.pessoaForm.value;

    const pessoa: Pessoa = {
      id: formValue.id,
      nome: formValue.nome,
      nomeSocial: formValue.nomeSocial,
      dataNascimento: formValue.dataNascimento,
      sexo: formValue.sexo,
      cpf: formValue.cpf,
      rg: formValue.rg,
      telefoneFixo: formValue.telefoneFixo,
      telefoneCelular: formValue.telefoneCelular,
      email: formValue.email,
      estadoCivil: formValue.estadoCivil,
      profissao: formValue.profissao,
      nacionalidade: formValue.nacionalidade,
      naturalidade: formValue.naturalidade,
      certificadoRegistro: formValue.certificadoRegistro,
      etnia: formValue.etnia,
      situacaoPessoa: formValue.situacaoPessoa,
      endereco: formValue.enderecoForm?.id, // pode ser só o ID ou montar o objeto completo se precisar
      descricao: formValue.descricao
    };

    if (this.isEdicao && pessoa.id) {
      this.pessoaService.updatePessoa(pessoa.id, pessoa, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarPessoas();
          this.resetarFormulario();
          alert('Pessoa atualizada com sucesso!');
        },
        error: err => alert(err.message)
      });
    } else {
      this.pessoaService.createPessoa(pessoa, this.imagemSelecionada).subscribe({
        next: () => {
          this.carregarPessoas();
          this.resetarFormulario();
          alert('Pessoa criada com sucesso!');
        },
        error: err => alert(err.message)
      });
    }
  }

  abrirModalEdicao(pessoa: Pessoa): void {
    this.isEdicao = true;
    this.pessoaForm.patchValue({
      ...pessoa,
      enderecoForm: pessoa.endereco || { pais: 'BRASIL' }
    });
  }

  confirmarExclusao(pessoa: Pessoa): void {
    this.modalExclusaoAberto = true;
    this.pessoaSelecionada = pessoa;
  }

  fecharModalExclusao(): void {
    this.modalExclusaoAberto = false;
    this.pessoaSelecionada = null;
  }

  excluirPessoa(): void {
    if (this.pessoaSelecionada?.id) {
      this.pessoaService.deletePessoa(this.pessoaSelecionada.id).subscribe({
        next: () => {
          this.carregarPessoas();
          this.fecharModalExclusao();
          alert('Pessoa excluída com sucesso!');
        },
        error: (err) => alert(err.message)
      });
    }
  }

  resetarFormulario(): void {
    this.pessoaForm.reset();
    this.pessoaForm.get('enderecoForm')?.reset({ pais: 'BRASIL' });
    this.imagemSelecionada = undefined;
    this.isEdicao = false;
    this.imagemPreview = null;
  }

  getImagemPessoa(pessoa: Pessoa): string {
    if (!pessoa.imagemUrl) return '';
    return this.fileService.getImageUrl('Pessoa', pessoa.imagemUrl);
  }
}
