import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../guards/auth/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PessoaEnvolvimento {
  id?: number;
  pessoaId: number;
  boletimId?: number;
  inqueritoId?: number;
  tipoEnvolvimento: string;
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaEnvolvimentoService {

  private apiUrl = `${environment.apiUrl}/pessoa_envolvimento`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  listarTodos(): Observable<PessoaEnvolvimento[]> {
    return this.http.get<PessoaEnvolvimento[]>(`${this.apiUrl}/list`, { headers: this.auth.getAuthHeaders() });
  }

  listarPorInquerito(inqueritoId: number): Observable<PessoaEnvolvimento[]> {
    return this.http.get<PessoaEnvolvimento[]>(`${this.apiUrl}/inquerito/${inqueritoId}`, { headers: this.auth.getAuthHeaders() });
  }

  listarPorBoletim(boletimId: number): Observable<PessoaEnvolvimento[]> {
  return this.http.get<PessoaEnvolvimento[]>(`${this.apiUrl}/boletim/${boletimId}`, { headers: this.auth.getAuthHeaders() });
}

  criar(dto: PessoaEnvolvimento): Observable<PessoaEnvolvimento> {
    return this.http.post<PessoaEnvolvimento>(`${this.apiUrl}/create`, dto, { headers: this.auth.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  atualizar(id: number, dto: PessoaEnvolvimento): Observable<PessoaEnvolvimento> {
    return this.http.put<PessoaEnvolvimento>(`${this.apiUrl}/update/${id}`, dto, { headers: this.auth.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.auth.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  buscarPorId(id: number): Observable<PessoaEnvolvimento> {
    return this.http.get<PessoaEnvolvimento>(`${this.apiUrl}/${id}`, { headers: this.auth.getAuthHeaders() });
  }
}
