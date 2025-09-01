import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/delegacia`;

  constructor(private http: HttpClient) { }


  /** Totais: delegacias, BOs, inquéritos, bens */
  getTotais(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totais`);
  }

  /** BOs por mês */
  getBosPorMes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bos-por-mes`);
  }

  /** Inquéritos agrupados por delegacia */
  getInqueritosPorDelegacia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inqueritos-por-delegacia`);
  }

  /** Bens agrupados por tipo */
  getBensPorTipo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bens-por-tipo`);
  }
}
