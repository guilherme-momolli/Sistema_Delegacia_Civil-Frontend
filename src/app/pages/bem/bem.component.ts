import { Component, OnInit } from '@angular/core';
import { BemResponseDTO } from '../../core/models/dto/bem/bem-response.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { identity } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PessoaService } from '../../core/service/pessoa/pessoa.service';
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';

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
  tipoBemSelecionado: string | null = null;
  tipoSelecionado: string | null = null;
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
  pessoaControl = new FormControl();
  pessoaSelecionada: any = null;
  pessoasFiltradas: any[] = [];
  formatarPessoa = (pessoa: any) => `${pessoa.nome} (${new CpfMaskPipe().transform(pessoa.cpf)})`;
  


  calibre = enumToKeyValueArray(Calibre, CalibreDescricao);
  especieArmaFogo = enumToKeyValueArray(EspecieArmaFogo, EspecieArmaFogoDescricao);
  situacaoArmaFogo = enumToKeyValueArray(SituacaoArmaFogo, SituacaoArmaFogoDescricao);
  tipoArmaFogo = enumToKeyValueArray(TipoArmaFogo, TipoArmaFogoDescricao);

  situacaoBem = enumToKeyValueArray(SituacaoBem, SituacaoBemDescricao);
  tipoBem = enumToKeyValueArray(TipoBem, TipoBemDescricao);

  tipoDroga = enumToKeyValueArray(TipoDroga, TipoDrogaDescricao);
  tipoUnidadeMedida = enumToKeyValueArray(UnidadeMedida, UnidadeMedidaDescricao)

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
    private pessoaService: PessoaService
  ) { }

  ngOnInit(): void {
    console.log('🟦 ngOnInit chamado');
    this.loadBens();
    this.inicializarForm();
    this.configurarPesquisaPessoa();
  }

  configurarPesquisaPessoa(): void {
    this.pessoaControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.pessoaService.getPessoasFiltradas({ nome: term }, 0, 10)),
      map(page => page.content)
    ).subscribe(pessoas => {
      this.pessoasFiltradas = pessoas;
    });
  }

  inicializarForm(): void {
    console.log('🟩 Inicializando formulário de Bem');
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
    console.log('🔵 Carregando lista de bens...');
    this.bemService.listarBens().subscribe({
      next: (data) => {
        console.log('✅ Bens carregados com sucesso:', data);
        this.bens = data;
      },
      error: (err) => console.error('❌ Erro ao carregar bens:', err)
    });
  }

  onPessoaSelecionada(pessoa: any) {
    this.pessoaSelecionada = pessoa;
  this.form.patchValue({ pessoaId: pessoa.id });
  }

  getImagemUrl(bem: BemResponseDTO): string {
    if (!bem.imagemUrl) return 'assets/img/placeholder.png';
    console.log("pegando imagem")
    let subFolder = 'Bens';

    console.log("tipo bem", bem.tipoBem)
    switch (bem.tipoBem?.toUpperCase()) {
      case 'ARMA': subFolder = 'Bens/Armas'; break;
      case 'VEICULO': subFolder = 'Bens/Veiculos'; break;
      case 'DROGA': subFolder = 'Bens/Drogas'; break;
      case 'OBJETO': subFolder = 'Bens/Objetos'; break;
      default: subFolder = 'Bens'; break;
    }

    console.log("folder final", subFolder, "bem url", bem.imagemUrl);
    const fullUrl = this.fileService.getImageUrl(subFolder, bem.imagemUrl);
    console.log(`🖼️ Imagem carregada para ${bem.tipoBem}:`, fullUrl);
    return fullUrl;
  }

  onTipoBemChange(): void {
    const tipo = this.form.get('tipoBem')?.value;

    if (!tipo) {
      console.warn('⚠️ Nenhum tipo de bem selecionado — ignorando onTipoBemChange');
      this.tipoBemSelecionado = null;
      return;
    }

    this.tipoBemSelecionado = tipo;

    if (tipo === 'ARMA') {
      this.form.get('arma')?.reset();
    } else if (tipo === 'DROGA') {
      this.form.get('droga')?.reset();
      this.form.patchValue({ marca: '', modelo: '' });
    } else if (tipo === 'OBJETO') {
      this.form.get('objeto')?.reset();
    } else if (tipo === 'VEICULO') {
      this.form.get('veiculo')?.reset();
    } else {
      this.tipoBemSelecionado = null;
    }
  }


  openModal(bem?: BemResponseDTO): void {
    this.showModal = true;
    this.isEditMode = !!bem;
    this.selectedBem = bem || null;

    if (this.isEditMode && bem) {
      this.form.reset();
      this.form.patchValue(bem);

      this.tipoBemSelecionado = bem.tipoBem || null;
      this.imagemPreview = bem.imagemUrl || null;
    } else {
      this.form.reset();
      this.tipoBemSelecionado = null;
      this.imagemPreview = null;
    }
  }



  closeModal(): void {
    console.log('❎ Fechando modal');
    this.showModal = false;
    this.selectedBem = null;
    this.selectedFile = undefined;
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
        this.bemService.cadastrarBem(bem, this.selectedFile).subscribe({
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