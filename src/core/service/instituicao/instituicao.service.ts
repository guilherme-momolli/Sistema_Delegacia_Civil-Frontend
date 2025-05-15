import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface Instituicao {
  id: number;
  secretaria: string;
  nomeFantasia: string;
  email: string;
  telefoneFixo?: string;
  telefoneCelular?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  private apiUrl = `${environment.apiUrl}/instituicao`;

  constructor(private http: HttpClient) { }

  getInstituicoes(): Observable<Instituicao[]> {
    return this.http.get<Instituicao[]>(`${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  getInstituicoesByUsuarioId(id: number): Observable<Instituicao[]> {
    return this.http.get<Instituicao[]>(`${this.apiUrl}/usuario/${id}`);
  }
  

  getInstituicaoById(id: number): Observable<Instituicao> {
    return this.http.get<Instituicao>(`${this.apiUrl}/list/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createInstituicao(instituicao: Partial<Instituicao>, senha: string): Observable<Instituicao> {
    const formData = new FormData();
    formData.append('instituicao', JSON.stringify(instituicao));
    formData.append('senha', senha);
    
    return this.http.post<Instituicao>(`${this.apiUrl}/create`, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateInstituicao(id: number, instituicao: Instituicao): Observable<Instituicao> {
    return this.http.put<Instituicao>(`${this.apiUrl}/update/${id}`, instituicao).pipe(
      catchError(this.handleError)
    );
  }

  deleteInstituicao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
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
          errorMessage = 'Instituição não encontrada. Verifique se o ID está correto.';
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

  private prepareFormData(instituicao:  Instituicao, senha: String): FormData {
      const formData = new FormData();
      formData.append('instituicao', new Blob([JSON.stringify(instituicao)], { type: 'application/json' }));
      return formData;
    }
}
