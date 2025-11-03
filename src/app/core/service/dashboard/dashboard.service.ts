import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DashboardResponseDTO } from '../../models/dto/dashboard/dashboard-response.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;


  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardResponseDTO> {
    console.log('🌐 Enviando requisição GET para:', this.apiUrl);
    return this.http.get<DashboardResponseDTO>(this.apiUrl).pipe(
      tap({
        next: (response) => console.log('✅ Resposta do backend:', response),
        error: (error) => console.error('❌ Erro na requisição do dashboard:', error)
      })
    );
  }
}
