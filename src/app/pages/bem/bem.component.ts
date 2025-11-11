import { Component, OnInit } from '@angular/core';
import { BemResponseDTO } from '../../core/models/dto/bem/bem-response.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { BemService } from '../../core/service/bem/bem.service';
import { BemRequestDTO } from '../../core/models/dto/bem/bem-request.dto';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileService } from '../../core/service/file/file.service';
import { enumToKeyValueArray } from '../../../shared/enums/enum-utils';
import { TipoVeiculo, TipoVeiculoDescricao } from '../../core/enum/veiculo/tipo-veiculo.enum';
import { TipoTracao, TipoTracaoDescricao } from '../../core/enum/veiculo/tipo-tracao.enum';
import { Cambio, CambioDescricao } from '../../core/enum/veiculo/cambio.enum';
import { Carroceria, CarroceriaDescricao } from '../../core/enum/veiculo/carroceria.enum';
import { CategoriaVeiculo, CategoriaVeiculoDescricao } from '../../core/enum/veiculo/categoria-veiculo.enum';
import { Combustivel, CombustivelDescricao } from '../../core/enum/veiculo/combustivel.enum';
import { EspecieVeiculo, EspecieVeiculoDescricao } from '../../core/enum/veiculo/especie-veiculo.enum';
import { SituacaoLicenciamento, SituacaoLicenciamentoDescricao } from '../../core/enum/veiculo/situacao-licenciamento.enum';
import { Calibre, CalibreDescricao } from '../../core/enum/arma/calibre.enum';
import { EspecieArmaFogo, EspecieArmaFogoDescricao } from '../../core/enum/arma/especie-arma-fogo.enum';
import { SituacaoArmaFogo, SituacaoArmaFogoDescricao } from '../../core/enum/arma/situacao-arma-fogo.enum';
import { TipoArmaFogo, TipoArmaFogoDescricao } from '../../core/enum/arma/tipo-arma-fogo.enum';
import { SituacaoBem, SituacaoBemDescricao } from '../../core/enum/bem/situacao-bem.enum';
import { TipoBem, TipoBemDescricao } from '../../core/enum/bem/tipo-bem.enum';
import { TipoDroga, TipoDrogaDescricao } from '../../core/enum/droga/tipo-droga.enum';
import { UnidadeMedida, UnidadeMedidaDescricao } from '../../core/enum/droga/unidade-medida.enum';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PessoaService } from '../../core/service/pessoa/pessoa.service';
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';

@Component({
  selector: 'app-bem',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './bem.component.html',
  styleUrls: ['./bem.component.css'],
})
export class BemComponent implements OnInit {

  bens: BemResponseDTO[] = [];
  form!: FormGroup;
  imagemSelecionada?: File;
  modalAberto = false;
  editando = false;
  tipoBemSelecionado: string | null = null;
  bemSelecionadoId?: number;
  mensagemSucesso = '';
  mensagemErro = '';
  selectedBem: BemResponseDTO | null = null;
  showModal = false;
  isEditMode = false;
  imagemPreview: string | null = null;
  selectedFile?: File;
  loading = false;
  message = '';

  // === PESQUISA DE PESSOA ===
  pessoaControl = new FormControl();
  pessoaSelecionada: any = null;
  pessoasFiltradas: any[] = [];

  // Enums
  calibre = enumToKeyValueArray(Calibre, CalibreDescricao);
  especieArmaFogo = enumToKeyValueArray(EspecieArmaFogo, EspecieArmaFogoDescricao);
  situacaoArmaFogo = enumToKeyValueArray(SituacaoArmaFogo, SituacaoArmaFogoDescricao);
  tipoArmaFogo = enumToKeyValueArray(TipoArmaFogo, TipoArmaFogoDescricao);
  situacaoBem = enumToKeyValueArray(SituacaoBem, SituacaoBemDescricao);
  tipoBem = enumToKeyValueArray(TipoBem, TipoBemDescricao);
  tipoDroga = enumToKeyValueArray(TipoDroga, TipoDrogaDescricao);
  tipoUnidadeMedida = enumToKeyValueArray(UnidadeMedida, UnidadeMedidaDescricao);
  cambio = enumToKeyValueArray(Cambio, CambioDescricao);
  carroceria = enumToKeyValueArray(Carroceria, CarroceriaDescricao);
  categoriaVeiculo = enumToKeyValueArray(CategoriaVeiculo, CategoriaVeiculoDescricao);
  combustivel = enumToKeyValueArray(Combustivel, CombustivelDescricao);
  especieVeiculo = enumToKeyValueArray(EspecieVeiculo, EspecieVeiculoDescricao);
  situacaoLicenciamento = enumToKeyValueArray(SituacaoLicenciamento, SituacaoLicenciamentoDescricao);
  tipoVeiculo = enumToKeyValueArray(TipoVeiculo, TipoVeiculoDescricao);
  tipoTracao = enumToKeyValueArray(TipoTracao, TipoTracaoDescricao);

  constructor(
    private bemService: BemService,
    private fileService: FileService,
    private fb: FormBuilder,
    private pessoaService: PessoaService  ) { }

  ngOnInit(): void {
    console.log('ngOnInit chamado');
    this.loadBens();
    this.inicializarForm();
    this.configurarPesquisaPessoa();
  }

  configurarPesquisaPessoa(): void {
    this.pessoaControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.trim().length < 2) {
          this.pessoasFiltradas = [];
          return [];
        }
        return this.pessoaService.getPessoasFiltradas({ nome: term.trim() }, 0, 10);
      }),
      map(page => page.content)
    ).subscribe(pessoas => {
      this.pessoasFiltradas = pessoas;
    });
  }

  selecionarPessoa(pessoa: any): void {
    this.pessoaSelecionada = pessoa;
    this.form.patchValue({ pessoaId: pessoa.id });
    this.pessoaControl.setValue(pessoa.nome);
    this.pessoasFiltradas = [];
  }

  removerPessoa(): void {
    this.pessoaSelecionada = null;
    this.form.patchValue({ pessoaId: null });
    this.pessoaControl.setValue('');
    this.pessoasFiltradas = [];
  }

  onPessoaBlur(): void {
    setTimeout(() => {
      if (!this.pessoaSelecionada) {
        this.pessoasFiltradas = [];
      }
    }, 200);
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      tipoBem: ['', Validators.required],
      marca: [''],
      imagemUrl: [''],
      modelo: [''],
      valorEstimado: [''],
      pessoaId: [''],
      delegaciaId: [null],
      situacaoBem: [''],
      origem: [''],
      numeroLacre: [''],
      localBem: [''],
      observacao: [''],
      descricao: [''],
      arma: this.fb.group({
        tipoArmaFogo: [''],
        especieArma: [''],
        calibre: [''],
        numeroPorte: [''],
        numeroSerie: [''],
        numeroRegistro: [''],
        capacidade: [''],
      }),
      droga: this.fb.group({
        tipoDroga: [''],
        nomePopular: [''],
        unidadeMedida: [''],
        quantidadePorExtenso: [''],
        quantidade: [''],
      }),
      objeto: this.fb.group({
        tipoObjeto: [''],
        numeroSerie: [''],
        cor: [''],
        material: [''],
        dimensoes: [''],
        estadoConservacao: [''],
        situacaoObjeto: ['']
      }),
      veiculo: this.fb.group({
        renavam: [''],
        placa: [''],
        chassi: [''],
        numeroMotor: [''],
        tipoVeiculo: [''],
        categoria: [''],
        especieVeiculo: [''],
        anoModelo: [''],
        anoFabricacao: [''],
        combustivel: [''],
        cambio: [''],
        tipoTracao: [''],
        corPredominante: [''],
        carroceria: [''],
        numeroEixos: [''],
        capacidadeCarga: [''],
        potenciaMotor: [''],
        cilindrada: [''],
        pesoBruto: [''],
        ufRegistro: [''],
        municipioRegistro: [''],
        situacaoVeiculo: [''],
        situacaoLicenciamento: [''],
        restricaoJudicial: [''],
        dataPrimeiroLicenciamento: [''],
        numeroCrv: [''],
        numeroCrlv: [''],
        tabelaFipe: ['']
      })
    });
  }

  getDescricaoSituacaoBem(situacaoBem: string): string {
    return SituacaoBemDescricao[situacaoBem as SituacaoBem] || situacaoBem;
  }

  getDescricaoTipoBem(tipoBem: string): string {
    return TipoBemDescricao[tipoBem as TipoBem] || tipoBem;
  }

  loadBens(): void {
    this.bemService.listarBens().subscribe({
      next: (data) => {
        this.bens = data;
      },
      error: (err) => console.error('Erro ao carregar bens:', err)
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
    return this.fileService.getImageUrl(subFolder, bem.imagemUrl);
  }

  onTipoBemChange(): void {
    const tipo = this.form.get('tipoBem')?.value;
    if (!tipo) {
      this.tipoBemSelecionado = null;
      return;
    }
    this.tipoBemSelecionado = tipo;
    if (tipo === 'ARMA') this.form.get('arma')?.reset();
    else if (tipo === 'DROGA') {
      this.form.get('droga')?.reset();
      this.form.patchValue({ marca: '', modelo: '' });
    } else if (tipo === 'OBJETO') this.form.get('objeto')?.reset();
    else if (tipo === 'VEICULO') this.form.get('veiculo')?.reset();
    else this.tipoBemSelecionado = null;
  }

  openModal(bem?: BemResponseDTO): void {
    this.showModal = true;
    this.isEditMode = !!bem;
    this.selectedBem = bem || null;

    // Resetar estados
    this.pessoaSelecionada = null;
    this.pessoaControl.setValue('');
    this.imagemPreview = null;
    this.selectedFile = undefined;

    if (this.isEditMode && bem) {
      this.form.reset();
      this.form.patchValue(bem);
      this.tipoBemSelecionado = bem.tipoBem || null;
      this.imagemPreview = bem.imagemUrl || null;

      // Carregar pessoa vinculada
      if (bem.pessoaId) {
        this.pessoaService.getPessoaById(bem.pessoaId).subscribe({
          next: (pessoa) => {
            this.pessoaSelecionada = pessoa;
            this.pessoaControl.setValue(pessoa.nome);
          },
          error: () => {
            console.warn('Pessoa não encontrada:', bem.pessoaId);
          }
        });
      }
    } else {
      this.form.reset();
      this.tipoBemSelecionado = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBem = null;
    this.selectedFile = undefined;
    this.imagemPreview = null;
    this.form.reset();
    this.pessoaSelecionada = null;
    this.pessoaControl.setValue('');
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const bem: BemRequestDTO = this.form.value;

    const uploadAndSave = (imagemUrl?: string) => {
      if (imagemUrl) bem.imagemUrl = imagemUrl;

      if (this.isEditMode && this.selectedBem) {
        this.bemService.atualizarBem(this.selectedBem.id, bem).subscribe({
          next: () => {
            this.message = 'Bem atualizado com sucesso!';
            this.loadBens();
            this.closeModal();
          },
          error: (err) => this.message = 'Erro ao atualizar: ' + err,
          complete: () => this.loading = false
        });
      } else {
        this.bemService.cadastrarBem(bem, this.selectedFile).subscribe({
          next: () => {
            this.message = 'Bem criado com sucesso!';
            this.loadBens();
            this.closeModal();
          },
          error: (err) => this.message = 'Erro ao criar: ' + err,
          complete: () => this.loading = false
        });
      }
    };

    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile, 'Bens').subscribe({
        next: (res) => uploadAndSave(res.fileUrl),
        error: () => {
          this.message = 'Erro no upload';
          this.loading = false;
        }
      });
    } else {
      uploadAndSave();
    }
  }

  deletar(bem: BemResponseDTO): void {
    if (confirm(`Excluir o bem ${bem.tipoBem}?`)) {
      this.bemService.deletarBem(bem.id).subscribe({
        next: () => {
          this.message = 'Bem excluído!';
          this.loadBens();
        },
        error: (err) => this.message = 'Erro ao excluir: ' + err
      });
    }
  }
}