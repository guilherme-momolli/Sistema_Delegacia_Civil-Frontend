import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  cards: any[] = [];
  chartBosLabels: string[] = [];
  chartBosData: number[] = [];
  chartDelegaciasLabels: string[] = [];
  chartDelegaciasData: number[] = [];
  chartBensLabels: string[] = [];
  chartBensData: number[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTotais().subscribe(data => {
      this.cards = [
        { titulo: 'Delegacias', valor: data.delegacias },
        { titulo: 'Boletins', valor: data.bos },
        { titulo: 'Inquéritos', valor: data.inqueritos },
        { titulo: 'Bens', valor: data.bens }
      ];
    });

    this.dashboardService.getBosPorMes().subscribe(data => {
      this.chartBosLabels = data.map(d => d.mes);
      this.chartBosData = data.map(d => d.total);
    });

    this.dashboardService.getInqueritosPorDelegacia().subscribe(data => {
      this.chartDelegaciasLabels = data.map(d => d.delegacia);
      this.chartDelegaciasData = data.map(d => d.total);
    });

    this.dashboardService.getBensPorTipo().subscribe(data => {
      this.chartBensLabels = data.map(d => d.tipo);
      this.chartBensData = data.map(d => d.total);
    });
  }
}
