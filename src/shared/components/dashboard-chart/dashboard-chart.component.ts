import { Component, Input, AfterViewInit } from '@angular/core';
import {
  Chart,
  ChartType,
  registerables
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { PessoaDashboardResponseDTO } from '../../../app/core/models/dto/pessoa/pessoa-dashboard-response.dto';
import { BoletimOcorrenciaDashboardResponseDTO } from '../../../app/core/models/dto/boletim-ocorrencia/boletim-ocorrencia-dashboard-response.dto';
import { BemDashboardResponseDTO } from '../../../app/core/models/dto/bem/bem-dashboard-response.dto';
import { InqueritoPolicialDashboardResponseDTO } from '../../../app/core/models/dto/inquerito-policial/inquerito-policial-dashboard-response.dto';
import { DashboardResponseDTO } from '../../../app/core/models/dto/dashboard/dashboard-response.dto';
import { ChartLabelPipe } from '../../../app/pipes/chart-label-pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements AfterViewInit {

  @Input() dashboard?: DashboardResponseDTO;

  getTotal(data: Record<string, number> | undefined): number {
    return data ? Object.values(data).reduce((a, b) => a + b, 0) : 0;
  }

  ngAfterViewInit() {
    if (!this.dashboard) return;

    const { pessoaDashboardResponse, bemDashboardResponse, boletimOcorrenciaDashboardResponse, inqueritoPolicialDashboardResponse } = this.dashboard;

    console.log('📊 Dashboard:', this.dashboard);

    if (pessoaDashboardResponse) this.renderPessoaCharts(pessoaDashboardResponse);
    if (bemDashboardResponse) this.renderBemCharts(bemDashboardResponse);
    if (boletimOcorrenciaDashboardResponse) this.renderBoletimCharts(boletimOcorrenciaDashboardResponse);
    if (inqueritoPolicialDashboardResponse) this.renderInqueritoCharts(inqueritoPolicialDashboardResponse);
  }

  private renderPessoaCharts(pessoa: PessoaDashboardResponseDTO) {
    this.createPieChart('chartGenero', 'Gênero', pessoa.totalPorGenero);
    this.createPieChart('chartEtnia', 'Etnia', pessoa.totalPorEtnia);
    this.createPieChart('chartEstadoCivil', 'Estado Civil', pessoa.totalPorEstadoCivil);
    this.createPieChart('chartSituacao', 'Situação da Pessoa', pessoa.totalPorSituacaoPessoa);
  }

  private renderBemCharts(bem: BemDashboardResponseDTO) {
    this.createPieChart('chartTipoBem', 'Tipo de Bem', bem.totalPorTipoBem);
    this.createPieChart('chartSituacaoBem', 'Situação do Bem', bem.totalPorSituacaoBem);

    if (bem.armaDashboardResponse) {
      const arma = bem.armaDashboardResponse;
      this.createPieChart('chartTipoArmaFogo', 'Tipo de Arma de Fogo', arma.totalPorTipoArmaFogo);
      this.createPieChart('chartEspecieArma', 'Espécie de Arma', arma.totalPorEspecieArma);
      this.createPieChart('chartSituacaoArma', 'Situação da Arma', arma.totalPorSituacaoArmaFogo);
      this.createPieChart('chartCalibre', 'Calibre', arma.totalPorCalibre);
    }

    if (bem.drogaDashboardResponse) {
      this.createPieChart('chartTipoDroga', 'Tipo de Droga', bem.drogaDashboardResponse.totalPorTipoDroga);
    }

    if (bem.veiculoDashboardResponse) {
      const v = bem.veiculoDashboardResponse;

      this.createPieChart('chartTipoVeiculo', 'Tipo de Veículo', v.totalPorTipoVeiculo);
      this.createPieChart('chartCategoriaVeiculo', 'Categoria do Veículo', v.totalPorCategoriaVeiculo);
      this.createPieChart('chartCombustivel', 'Combustível', v.totalPorCombustivel);
      this.createPieChart('chartSituacaoVeiculo', 'Situação do Veículo', v.totalPorSituacaoVeiculo);
      this.createPieChart('chartSituacaoLicenciamento', 'Situação do Licenciamento', v.totalPorSituacaoLicenciamento);
      this.createPieChart('chartEspecieVeiculo', 'Espécie do Veículo', v.totalPorEspecieVeiculo);
      this.createPieChart('chartTipoTracao', 'Tipo de Tração', v.totalPorTipoTracao);
      this.createPieChart('chartCambio', 'Câmbio', v.totalPorCambio);
      this.createPieChart('chartCarroceria', 'Carroceria', v.totalPorCarroceria);
    }

  }

  private renderBoletimCharts(boletim: BoletimOcorrenciaDashboardResponseDTO) {
    this.createPieChart('chartOrigemBoletim', 'Origem Força Policial (Boletim)', boletim.totalPorOrigemForcaPolicial);
  }

  private renderInqueritoCharts(inquerito: InqueritoPolicialDashboardResponseDTO) {
    this.createPieChart('chartOrigemInquerito', 'Origem Força Policial (Inquérito)', inquerito.totalPorOrigemForcaPolicial);
    this.createPieChart('chartSituacaoInquerito', 'Situação do Inquérito', inquerito.totalPorSituacaoInquerito);
  }

  private createPieChart(id: string, title: string, dataMap: Record<string, number>) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx || !dataMap) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(dataMap),
        datasets: [{
          data: Object.values(dataMap),
          backgroundColor: [
            '#0d6efd', '#198754', '#ffc107',
            '#dc3545', '#6f42c1', '#20c997', '#fd7e14'
          ],
          borderColor: '#212529',
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f8f9fa', font: { size: 13 } }
          },
          title: {
            display: true,
            text: title,
            color: '#f8f9fa',
            font: { size: 16, weight: 'bold' }
          }
        },
        layout: {
          padding: 10
        }
      }
    });
  }

}