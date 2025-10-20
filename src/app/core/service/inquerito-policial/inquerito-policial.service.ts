import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Timestamp } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PessoaEnvolvimento } from '../pessoa-envolvimento/pessoa-envolvimento.service';
import { InqueritoPolicialResponseDTO } from '../../models/dto/inquerito-policial/inquerito-policial-response.dto';

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

  constructor(private http: HttpClient) { }

  getAll(): Observable<InqueritoPolicialResponseDTO[]> {
    return this.http.get<InqueritoPolicialResponseDTO[]>(`${this.apiUrl}/list`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<InqueritoPolicialResponseDTO> {
    return this.http.get<InqueritoPolicialResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByDelegacia(delegaciaId: number): Observable<InqueritoPolicialResponseDTO[]> {
    return this.http.get<InqueritoPolicialResponseDTO[]>(`${this.apiUrl}/delegacia/${delegaciaId}`)
      .pipe(catchError(this.handleError));
  }

  create(payload: InqueritoPolicialRequestDTO): Observable<InqueritoPolicialResponseDTO> {
    return this.http.post<InqueritoPolicialResponseDTO>(`${this.apiUrl}/create`, payload)
      .pipe(catchError(this.handleError));
  }

  update(id: number, payload: InqueritoPolicialRequestDTO): Observable<InqueritoPolicialResponseDTO> {
    return this.http.put<InqueritoPolicialResponseDTO>(`${this.apiUrl}/update/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400: errorMessage = 'Requisição inválida.'; break;
        case 404: errorMessage = 'Inquérito não encontrado.'; break;
        case 500: errorMessage = 'Erro interno do servidor.'; break;
        default: errorMessage = `Erro inesperado (${error.status}): ${error.message}`;
      }
    }
    console.error('Erro na API InqueritoPolicial:', errorMessage, 'Detalhes:', error.error);
    return throwError(() => new Error(errorMessage));
  }
}