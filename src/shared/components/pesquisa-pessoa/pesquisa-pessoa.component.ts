import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Pessoa, PessoaService } from '../../../app/core/service/pessoa/pessoa.service';
import { PessoaResponseDTO } from '../../../app/core/models/dto/pessoa/pessoa-response.dto';
import { Page } from '../../../app/core/models/page/page.model';
import { CommonModule } from '@angular/common';
import { Genero, GeneroDescricao, TipoEnvolvimento, TipoEnvolvimentoDescricao } from '../../enums/index.enum';
import { enumToKeyValueArray } from '../../enums/enum-utils';
import { PessoaEnvolvimentoRequestDTO } from '../../../app/core/models/dto/pessoa-envolvimento/pessoa-envolvimento-request.dto';


@Component({
  standalone: true,
  selector: 'app-pesquisa-pessoa',
  templateUrl: './pesquisa-pessoa.component.html',
  styleUrls: ['./pesquisa-pessoa.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class PesquisaPessoaComponent implements OnInit {

  @Input() pessoasSelecionadas: PessoaEnvolvimentoRequestDTO[] = [];
  @Output() pessoaSelecionada = new EventEmitter<PessoaEnvolvimentoRequestDTO>();
  @Output() pessoaRemovida = new EventEmitter<number>();

  filtroNome = new FormControl('');
  filtroCpf = new FormControl('');
  filtroGenero = new FormControl('');

  tipoEnvolvimentoSelecionado = new FormControl<string | null>(null);

  pessoasFiltradas: PessoaResponseDTO[] = [];
  generos = enumToKeyValueArray(Genero, GeneroDescricao);
  tipoEnvolvimento = enumToKeyValueArray(TipoEnvolvimento, TipoEnvolvimentoDescricao);

  paginaAtual = 0;
  tamanhoPagina = 10;
  totalElementos = 0;

  Math = Math;

  constructor(private pessoaService: PessoaService) { }

  ngOnInit(): void {
    this.filtroNome.valueChanges.pipe(debounceTime(400)).subscribe(() => this.buscarPessoas());
    this.filtroCpf.valueChanges.pipe(debounceTime(400)).subscribe(() => this.buscarPessoas());
    this.filtroGenero.valueChanges.subscribe(() => this.buscarPessoas());

    this.buscarPessoas();
  }


  getDescricaoGenero(sexo: string): string {
    return GeneroDescricao[sexo as Genero] || sexo;
  }

  buscarPessoas(): void {
    const filtros = {
      nome: this.filtroNome.value,
      cpf: this.filtroCpf.value,
      sexo: this.filtroGenero.value
    };

    this.pessoaService.getPessoasFiltradas(filtros, this.paginaAtual, this.tamanhoPagina)
      .subscribe({
        next: (res: Page<PessoaResponseDTO>) => {
          this.pessoasFiltradas = res.content;
          this.totalElementos = res.totalElements;
        },
        error: (err) => console.error('Erro ao buscar pessoas', err)
      });
  }

  adicionarPessoa(pessoa: PessoaResponseDTO): void {
    const tipo = this.tipoEnvolvimentoSelecionado.value;

    if (!tipo) {
      alert('Selecione o tipo de envolvimento antes de adicionar!');
      return;
    }

    if (this.pessoasSelecionadas.some(p => p.pessoaId === pessoa.id)) {
      alert('Essa pessoa já foi adicionada.');
      return;
    }

    const envolvimento: PessoaEnvolvimentoRequestDTO = {
      pessoaId: pessoa.id!,
      tipoEnvolvimento: tipo
    };

    this.pessoasSelecionadas.push(envolvimento);
    this.pessoaSelecionada.emit(envolvimento);
  }

  removerPessoa(pessoaId: number): void {
    this.pessoasSelecionadas = this.pessoasSelecionadas.filter(p => p.pessoaId !== pessoaId);
    this.pessoaRemovida.emit(pessoaId);
  }

  isPessoaJaAdicionada(pessoaId: number): boolean {
    return this.pessoasSelecionadas.some(p => p.pessoaId === pessoaId);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.buscarPessoas();
  }
}