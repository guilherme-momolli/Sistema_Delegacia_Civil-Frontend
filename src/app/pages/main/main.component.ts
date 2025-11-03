import { Component, OnInit } from '@angular/core';
import { DashboardResponseDTO } from '../../core/models/dto/dashboard/dashboard-response.dto';
import { DashboardService } from '../../core/service/dashboard/dashboard.service';
import { DashboardChartComponent } from "../../../shared/components/dashboard-chart/dashboard-chart.component";
import { PessoaDashboardResponseDTO } from '../../core/models/dto/pessoa/pessoa-dashboard-response.dto';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, DashboardChartComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  
 dashboardData?: DashboardResponseDTO;
  isLoading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.errorMessage = 'Não foi possível carregar os dados do dashboard.';
        this.isLoading = false;
      }
    });
  }
}
