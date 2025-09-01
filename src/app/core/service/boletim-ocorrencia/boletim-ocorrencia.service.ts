import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface BoletimOcorrencia {
  id?: number;
  origem: string;
  dataOcorrencia: string;
  endereco: {
    id: number;
  };
  boletim: string;
  natureza: string;
  autor: string;
  vitima: string;
  represetacao: string;
  instituicao: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BoletimOcorrenciaService {
  private apiUrl = `${environment.apiUrl}/boletim_ocorrencia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BoletimOcorrencia[]> {
    return this.http.get<BoletimOcorrencia[]>(`${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<BoletimOcorrencia> {
    return this.http.get<BoletimOcorrencia>(`${this.apiUrl}/getById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getByInstituicao(instituicaoId: number): Observable<BoletimOcorrencia[]> {
    return this.http.get<BoletimOcorrencia[]>(`${this.apiUrl}/instituicao/${instituicaoId}`).pipe(
      catchError(this.handleError)
    );
  }

  create(bo: BoletimOcorrencia): Observable<BoletimOcorrencia> {
    return this.http.post<BoletimOcorrencia>(`${this.apiUrl}/create`, bo).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, bo: BoletimOcorrencia): Observable<BoletimOcorrencia> {
    return this.http.put<BoletimOcorrencia>(`${this.apiUrl}/update/${id}`, bo).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
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
          errorMessage = 'Requisição inválida.';
          break;
        case 404:
          errorMessage = 'Boletim não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno no servidor.';
          break;
        default:
          errorMessage = `Erro inesperado (${error.status}): ${error.message}`;
      }
    }
    console.error('Erro na API BoletimOcorrencia:', errorMessage, 'Detalhes:', error.error);
    return throwError(() => new Error(errorMessage));
  }
}