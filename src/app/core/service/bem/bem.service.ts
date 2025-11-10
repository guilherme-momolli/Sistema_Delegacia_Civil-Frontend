import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, forkJoin, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BemResponseDTO } from '../../models/dto/bem/bem-response.dto';
import { BemRequestDTO } from '../../models/dto/bem/bem-request.dto';
import { Page } from '../../models/page/page.model';

@Injectable({
  providedIn: 'root'
})
export class BemService {

  baseUrl = `${environment.apiUrl}/bens`;

  constructor(private http: HttpClient) { }

  listarBens(): Observable<BemResponseDTO[]> {
    return this.http.get<BemResponseDTO[]>(`${this.baseUrl}/list`);
  }

  buscarBemPorId(id: number): Observable<BemResponseDTO> {
    return this.http.get<BemResponseDTO>(`${this.baseUrl}/getById/${id}`);
  }

  getByIds(ids: number[]): Observable<BemResponseDTO[]> {
    if (ids.length === 0) {
      return of([]);
    }
    const requests = ids.map(id => this.buscarBemPorId(id));
    return forkJoin(requests).pipe(
      catchError(err => {
        console.error('Erro ao carregar pessoas:', err);
        return of([]);
      })
    );
  }

  getBensFiltrados(filtro: any, page: number = 0, size: number = 10): Observable<Page<BemResponseDTO>> {
    const params: any = {
      page: String(page),
      size: String(size)
    };

    Object.keys(filtro || {}).forEach(key => {
      const value = filtro[key];
      if (value !== null && value !== undefined && value !== '') {
        params[key] = String(value);
      }
    });

    return this.http.get<Page<BemResponseDTO>>(`${this.baseUrl}/search`, { params }).pipe(
      tap(response => {
        console.log('📦 Retorno da API (getBensFiltrados):', response);
      }),
      catchError(this.handleError)
    );
  }



  cadastrarBem(bem: BemRequestDTO, imagem?: File): Observable<BemResponseDTO> {
    const formData = new FormData();
    formData.append('bem', new Blob([JSON.stringify(bem)], { type: 'application/json' }));
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.http.post<BemResponseDTO>(`${this.baseUrl}`, formData);
  }

  atualizarBem(id: number, bem: BemRequestDTO, imagem?: File): Observable<BemResponseDTO> {
    const formData = new FormData();
    formData.append('bem', new Blob([JSON.stringify(bem)], { type: 'application/json' }));
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.http.put<BemResponseDTO>(`${this.baseUrl}/${id}`, formData);
  }

  deletarBem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
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