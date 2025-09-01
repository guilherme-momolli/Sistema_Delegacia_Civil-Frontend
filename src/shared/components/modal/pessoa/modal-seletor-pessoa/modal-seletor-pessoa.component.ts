import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Pessoa, PessoaService } from '../../../../../app/core/service/pessoa/pessoa.service';
import { FormsModule } from '@angular/forms';


interface PessoaPesquisa {
  id: number;
  nome: string;
  cpf: string;
  sexo: string;
}

@Component({
  selector: 'app-modal-seletor-pessoa',
   standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-seletor-pessoa.component.html',
  styleUrls: ['./modal-seletor-pessoa.component.css'] 
})
export class ModalSeletorPessoaComponent implements OnInit {
  pessoas: Pessoa[] = [];
  selecionadas: Pessoa[] = [];

  filtroNome = '';
  filtroCpf = '';
  filtroSexo = '';

  @Output() selecionadasChange: EventEmitter<Pessoa[]> = new EventEmitter<Pessoa[]>();

  constructor(private pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.carregarPessoas();
  }

  carregarPessoas() {
    this.pessoaService.getPessoas().subscribe({
      next: (res) => this.pessoas = res,
      error: (err) => console.error('Erro ao carregar pessoas:', err)
    });
  }

  get pessoasFiltradas(): Pessoa[] {
    return this.pessoas.filter(p =>
      p.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) &&
      (this.filtroCpf ? p.cpf?.includes(this.filtroCpf) : true) &&
      (this.filtroSexo ? p.sexo === this.filtroSexo : true)
    );
  }

  selecionar(pessoa: Pessoa) {
    if (!this.selecionadas.find(p => p.id === pessoa.id)) {
      this.selecionadas.push(pessoa);
    }
  }

  remover(pessoa: Pessoa) {
    this.selecionadas = this.selecionadas.filter(p => p.id !== pessoa.id);
  }

  confirmar() {
    this.selecionadasChange.emit(this.selecionadas);
  }
}
