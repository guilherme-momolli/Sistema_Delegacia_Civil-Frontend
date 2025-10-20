import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BoletimOcorrenciaResponseDTO } from '../../models/dto/boletim-ocorrencia/boletim-ocorrencia-response.dto';
import { BoletimOcorrenciaRequestDTO } from '../../models/dto/boletim-ocorrencia/boletim-ocorrencia-request.dto';
import { normalizeDate } from '../../utils/date.utils';

@Injectable({ providedIn: 'root' })
export class BoletimOcorrenciaService {
  private apiUrl = `${environment.apiUrl}/boletim_ocorrencia`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BoletimOcorrenciaResponseDTO[]> {
    return this.http.get<BoletimOcorrenciaResponseDTO[]>(`${this.apiUrl}/list`)
      .pipe(
        map(items => items.map(this.normalizeResponse)),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<BoletimOcorrenciaResponseDTO> {
    return this.http.get<BoletimOcorrenciaResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(map(this.normalizeResponse), catchError(this.handleError));
  }

  getByDelegacia(delegaciaId: number): Observable<BoletimOcorrenciaResponseDTO[]> {
    return this.http.get<BoletimOcorrenciaResponseDTO[]>(`${this.apiUrl}/delegacia/${delegaciaId}`)
      .pipe(
        map(items => items.map(this.normalizeResponse)),
        catchError(this.handleError)
      );
  }

  create(payload: BoletimOcorrenciaRequestDTO): Observable<BoletimOcorrenciaResponseDTO> {
    return this.http.post<BoletimOcorrenciaResponseDTO>(`${this.apiUrl}/create`, payload)
      .pipe(map(this.normalizeResponse), catchError(this.handleError));
  }

  update(id: number, payload: BoletimOcorrenciaRequestDTO): Observable<BoletimOcorrenciaResponseDTO> {
    return this.http.put<BoletimOcorrenciaResponseDTO>(`${this.apiUrl}/update/${id}`, payload)
      .pipe(map(this.normalizeResponse), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

 private normalizeResponse(dto: BoletimOcorrenciaResponseDTO): BoletimOcorrenciaResponseDTO {
  try {
    return {
      ...dto,
      dataOcorrencia: normalizeDate((dto as any).dataOcorrencia) ?? '',
      pessoasEnvolvidas: dto.pessoasEnvolvidas ?? [],
    };
  } catch (e) {
    console.warn('Erro ao normalizar boletim:', e, dto);
    return { ...dto, dataOcorrencia: '' };
  }
}


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400: errorMessage = 'Requisição inválida.'; break;
        case 404: errorMessage = 'Boletim não encontrado.'; break;
        case 500: errorMessage = 'Erro interno no servidor.'; break;
        default: errorMessage = `Erro inesperado (${error.status}): ${error.message}`;
      }
    }
    console.error('Erro na API BoletimOcorrencia:', errorMessage, 'Detalhes:', error.error);
    return throwError(() => new Error(errorMessage));
  }
}
