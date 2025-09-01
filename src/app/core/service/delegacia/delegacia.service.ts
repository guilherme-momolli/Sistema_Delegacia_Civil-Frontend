import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Endereco } from '../endereco/endereco.service';

export interface Delegacia {
  id?: number;
  imagemUrl?: string;
  secretaria: string;
  nome: string;
  email: string;
  telefoneFixo?: string;
  telefoneCelular?: string;
  endereco?: Endereco;
}

@Injectable({
  providedIn: 'root'
})
export class DelegaciaService {

  private apiUrl = `${environment.apiUrl}/delegacia`;

  constructor(private http: HttpClient) { }

  getDelegacias(): Observable<Delegacia[]> {
    return this.http.get<Delegacia[]>(`${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  getDelegaciasByUsuarioId(id: number): Observable<Delegacia[]> {
    return this.http.get<Delegacia[]>(`${this.apiUrl}/usuario/${id}`);
  }

  getDelegaciaById(id: number): Observable<Delegacia> {
    return this.http.get<Delegacia>(`${this.apiUrl}/list/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createDelegacia(delegacia: Partial<Delegacia>, senha: string, imagem?: File): Observable<Delegacia> {
    const formData = new FormData();
    const delegaciaLimpa = this.limparCampos(delegacia);

    const delegaciaJson = JSON.stringify(delegaciaLimpa);

    formData.append('delegacia', new Blob([
      delegaciaJson
    ], { type: 'application/json' }));

    formData.append('senha', senha);

    if (imagem) {
      formData.append('imagem', imagem, imagem.name);
    }

    return this.http.post<Delegacia>(`${this.apiUrl}/create`, formData)
      .pipe(catchError(this.handleError));
  }

  updateDelegacia(id: number, delegacia: Delegacia, senha?: string, imagem?: File): Observable<Delegacia> {
    const formData = new FormData();
    formData.append('delegacia', JSON.stringify(this.limparCampos(delegacia)));
    if (senha && senha.trim() !== '') {
      formData.append('senha', senha);
    }
    if (imagem) {
      formData.append('imagem', imagem, imagem.name);
    }
    return this.http.put<Delegacia>(`${this.apiUrl}/update/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteDelgacia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private limparCampos(obj: any): any {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
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

  private prepareFormData(delegacia: Delegacia, senha: String): FormData {
    const formData = new FormData();
    formData.append('delegacia', new Blob([JSON.stringify(delegacia)], { type: 'application/json' }));
    return formData;
  }
}
