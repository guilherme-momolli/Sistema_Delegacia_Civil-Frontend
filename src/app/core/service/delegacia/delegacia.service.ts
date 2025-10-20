import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Endereco } from '../endereco/endereco.service';
import { DelegaciaResponseDTO } from '../../models/dto/delegacia/delegacia-response.dto';
import { DelegaciaRequestDTO } from '../../models/dto/delegacia/delegacia-request.dto';


@Injectable({
  providedIn: 'root'
})
export class DelegaciaService {

  private apiUrl = `${environment.apiUrl}/delegacia`;

  constructor(private http: HttpClient) { }

  getDelegacias(): Observable<DelegaciaResponseDTO[]> {
    return this.http.get<DelegaciaResponseDTO[]>(`${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  getDelegaciasByUsuarioId(id: number): Observable<DelegaciaResponseDTO[]> {
    return this.http.get<DelegaciaResponseDTO[]>(`${this.apiUrl}/usuario/${id}`);
  }

  getDelegaciaById(id: number): Observable<DelegaciaResponseDTO> {
    return this.http.get<DelegaciaResponseDTO>(`${this.apiUrl}/list/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createDelegacia(delegacia: Partial<DelegaciaRequestDTO>, imagem?: File): Observable<DelegaciaResponseDTO> {
    const formData = new FormData();
    const delegaciaLimpa = this.limparCampos(delegacia);
    const delegaciaJson = JSON.stringify(delegaciaLimpa);

    formData.append('delegacia', new Blob([delegaciaJson], { type: 'application/json' }));

    if (imagem) {
      formData.append('imagem', imagem, imagem.name);
    }

    return this.http.post<DelegaciaResponseDTO>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  // ✅ PUT /delegacia/{id}
  updateDelegacia(id: number, delegacia: DelegaciaRequestDTO, imagem?: File): Observable<DelegaciaResponseDTO> {
    const formData = new FormData();
    formData.append('delegacia', new Blob([JSON.stringify(this.limparCampos(delegacia))], { type: 'application/json' }));

    if (imagem) {
      formData.append('imagem', imagem, imagem.name);
    }

    return this.http.put<DelegaciaResponseDTO>(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteDelegacia(id: number): Observable<void> {
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
          errorMessage = 'Delegacia não encontrada.';
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
