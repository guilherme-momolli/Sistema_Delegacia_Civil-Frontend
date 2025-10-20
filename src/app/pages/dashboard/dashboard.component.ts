import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard/dashboard.service';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cards$!: any;
  bosPorMes$!: any;
  inqueritosPorDelegacia$!: any;
  bensPorTipo$!: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Inicializa os observables aqui
    this.cards$ = this.dashboardService.getTotais();
    this.bosPorMes$ = this.dashboardService.getBosPorMes();
    this.inqueritosPorDelegacia$ = this.dashboardService.getInqueritosPorDelegacia();
    this.bensPorTipo$ = this.dashboardService.getBensPorTipo();

    // Inicializa os gráficos
    this.initCharts();
  }

  private initCharts(): void {
    this.dashboardService.getBosPorMes().subscribe(data => {
      new Chart('graficoBos', {
        type: 'bar',
        data: {
          labels: data.map(d => d.mes),
          datasets: [{
            label: 'BOs por mês',
            data: data.map(d => d.total),
            backgroundColor: 'rgba(30,144,255,0.7)'
          }]
        }
      });
    });

    this.dashboardService.getBensPorTipo().subscribe(data => {
      new Chart('graficoBens', {
        type: 'pie',
        data: {
          labels: data.map(d => d.tipo),
          datasets: [{
            label: 'Bens por tipo',
            data: data.map(d => d.total),
            backgroundColor: ['#1E90FF', '#FF6347', '#32CD32', '#FFD700']
          }]
        }
      });
    });
  }
}