import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Timestamp } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PessoaEnvolvimento } from '../pessoa-envolvimento/pessoa-envolvimento.service';

export interface InqueritoPolicialRequestDTO {
  inqueritoPolicial: InqueritoPolicial;
  pessoasEnvolvidas: PessoaEnvolvimento[];
}

export interface InqueritoPolicial {
  id?: number;
  numeroJustica: string;
  ordemIp: number;
  data: string;
  peca: string;
  situacaoInquerito: string;
  origemForcaPolicial: string;
  naturezaDoDelito: string;
  delegaciaId: number;
  observacao: string;
  pessoasEnvolvidas?: PessoaEnvolvimento[];
}

@Injectable({
  providedIn: 'root'
})
export class InqueritoPolicialService {
  private apiUrl = `${environment.apiUrl}/inquerito_policial`;
  private fileUrl = `${environment.apiUrl}/file/v1`;

  constructor(private http: HttpClient) { }

  getInqueritos(): Observable<InqueritoPolicial[]> {
    return this.http.get<InqueritoPolicial[]>(`${this.apiUrl}/list`).pipe(catchError(this.handleError));
  }

  getInqueritoById(id: number): Observable<InqueritoPolicial> {
    return this.http.get<InqueritoPolicial>(`${this.apiUrl}/getById/${id}`).pipe(catchError(this.handleError));
  }

  getInqueritosByDelegacia(delegaciaId: number): Observable<InqueritoPolicial[]> {
    return this.http.get<InqueritoPolicial[]>(`${this.apiUrl}/delegacia/${delegaciaId}`).pipe(catchError(this.handleError));
  }

  createInquerito(payload: InqueritoPolicialRequestDTO): Observable<InqueritoPolicial> {
    return this.http.post<InqueritoPolicial>(
      `${this.apiUrl}/create`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(catchError(this.handleError));
  }

  updateInquerito(id: number, payload: InqueritoPolicialRequestDTO): Observable<InqueritoPolicial> {
    return this.http.put<InqueritoPolicial>(
      `${this.apiUrl}/update/${id}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(catchError(this.handleError));
  }

  deleteInquerito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(catchError(this.handleError));
  }

  downloadExcelAll(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
  }

  downloadExcelByDelegacia(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel/delegacia/${id}`, { responseType: 'blob' });
  }

  public prepareFormData(inquerito: InqueritoPolicial): FormData {
    const formData = new FormData();
    formData.append('inquerito', new Blob([JSON.stringify(inquerito)], { type: 'application/json' }));

    return formData;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requisição inválida. Verifique os dados enviados.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado. Verifique se o ID está correto.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro inesperado (${error.status}): ${error.message}`;
      }
    }
    console.error('Erro na API:', errorMessage, 'Detalhes:', error.error);
    return throwError(() => new Error(errorMessage));
  }
}
