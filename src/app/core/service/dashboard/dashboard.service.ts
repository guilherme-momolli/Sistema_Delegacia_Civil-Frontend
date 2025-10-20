import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;


  constructor(private http: HttpClient) { }

  getTotais(): Observable<{ delegacias: number, bos: number, inqueritos: number, bens: number }> {
    return this.http.get<{ delegacias: number, bos: number, inqueritos: number, bens: number }>(`${this.apiUrl}/totais`);
  }

  getBosPorMes(): Observable<{ mes: string, total: number }[]> {
    return this.http.get<{ mes: string, total: number }[]>(`${this.apiUrl}/bos-por-mes`);
  }

  getInqueritosPorDelegacia(): Observable<{ delegacia: string, total: number }[]> {
    return this.http.get<{ delegacia: string, total: number }[]>(`${this.apiUrl}/inqueritos-por-delegacia`);
  }

  getBensPorTipo(): Observable<{ tipo: string, total: number }[]> {
    return this.http.get<{ tipo: string, total: number }[]>(`${this.apiUrl}/bens-por-tipo`);
  }
}
