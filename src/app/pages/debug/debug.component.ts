import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements AfterViewInit {
  @ViewChild('graficoPizza') graficoPizza!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoBarras') graficoBarras!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoLinha') graficoLinha!: ElementRef<HTMLCanvasElement>;

  debugForm: FormGroup;
  isDarkMode = false;
  modalAberto = false;
  showAlert = true;
  dropdownOpen = false;
  showTooltip = false;
  selectedOption = '';
  toggleActive = false;
  isCardFlipped = false;
  progressValue = 80;
  tableData = [
    { nome: 'João', status: 'Ativo', selected: true },
    { nome: 'Maria', status: 'Inativo', selected: false },
    { nome: 'Lucas', status: 'Pendente', selected: false },
    { nome: 'Fernanda', status: 'Ativo', selected: false }
  ];
  currentPage = 1;
  itemsPerPage = 2;
  totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);

  constructor(private fb: FormBuilder) {
    this.debugForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      telefone: [''],
      dataNascimento: [''],
      dataHora: [''],
      calendario: [''],
      genero: [''],
      status: ['ativo'],
      aceite: [false, Validators.requiredTrue],
      corFavorita: ['#563d7c'],
      satisfacao: [5],
      mensagem: ['']
    });

    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  ngAfterViewInit() {
    this.criarGraficoPizza();
    this.criarGraficoBarras();
    this.criarGraficoLinha();
  }

  criarGraficoPizza() {
    new Chart(this.graficoPizza.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Ativo', 'Inativo', 'Pendente'],
        datasets: [{
          label: 'Status',
          data: [45, 25, 30],
          backgroundColor: ['var(--color-success)', 'var(--color-danger)', 'var(--color-warning)'],
          hoverOffset: 20
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    });
  }

  criarGraficoBarras() {
    new Chart(this.graficoBarras.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
        datasets: [{
          label: 'Entradas',
          data: [12, 19, 3, 5],
          backgroundColor: 'var(--color-primary)',
          borderColor: 'var(--color-primary-dark)',
          borderWidth: 1
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    });
  }

  criarGraficoLinha() {
    new Chart(this.graficoLinha.nativeElement, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Progresso',
          data: [0, 10, 20, 10, 30],
          fill: false,
          borderColor: 'var(--color-primary)',
          tension: 0.3
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    document.body.classList.toggle('dark-mode');
  }

  openModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  dismissAlert() {
    this.showAlert = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectDropdownItem(item: string) {
    this.selectedOption = item;
    this.dropdownOpen = false;
  }

  flipCard() {
    this.isCardFlipped = !this.isCardFlipped;
  }

  selectAllRows(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableData.forEach(row => (row.selected = checked));
    this.updateSelectedRows();
  }

  updateSelectedRows() {
    // Lógica adicional para manipular linhas selecionadas, se necessário
    console.log('Linhas selecionadas:', this.tableData.filter(row => row.selected));
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSubmit() {
    if (this.debugForm.valid) {
      console.log('Formulário enviado:', this.debugForm.value);
      this.showAlert = true;
    }
  }
}