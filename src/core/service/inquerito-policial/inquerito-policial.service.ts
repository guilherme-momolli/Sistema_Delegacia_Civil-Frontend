import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Timestamp } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Instituicao } from '../instituicao/instituicao.service';

export interface Droga {
  id: number;
  tipoDroga: string;
  nomePopular: string;
  unidadeMedida: string;
  quantidade: number;
  quantidadePericia: number;
  quantidadePorExtenso: string;
  observacao: string;
  numeroLacre: number;
  localDroga: string;
  situacaoDroga: string;
  inqueritoPolicialId: number;
}


export interface Arma {
  id: number;
  tipoArmaFogo: string;
  especie: string;
  marca: string;
  calibre: string;
  numeroPorte: string;
  numeroSerie: string;
  numeroRegistro: string;
  capacidade: number;
  quantidade: string;
  numeroLacre: string;
  valor: number;
  localArma: number;
  situacaoArma: string;
}

export interface InqueritoPolicial {
  id: number;
  numeroJustica: string;
  ordemIp: number;
  data: string;
  peca: string;
  situacaoInquerito: string;
  relator: string;
  origemForcaPolicial: string;
  investigado: string;
  vitima: string;
  naturezaDoDelito: string;
  arma: Arma[];
  droga: Droga[];
  instituicao: {
    id: number;
  };
  observacaoInquerito: string;
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
    return this.http.get<InqueritoPolicial>(`${this.apiUrl}/list/${id}`).pipe(catchError(this.handleError));
  }

  getInqueritosByInstituicao(instituicaoId: number): Observable<InqueritoPolicial[]> {
    return this.http.get<InqueritoPolicial[]>(`${this.apiUrl}/instituicao/${instituicaoId}`).pipe(catchError(this.handleError));
  }

  createInquerito(inquerito: InqueritoPolicial): Observable<InqueritoPolicial> {
    return this.http.post<InqueritoPolicial>(`${this.apiUrl}/create`, inquerito)
      .pipe(catchError(this.handleError));
  }

  updateInquerito(id: number, inquerito: InqueritoPolicial): Observable<InqueritoPolicial> {
    return this.http.put<InqueritoPolicial>(`${this.apiUrl}/update/${id}`, inquerito)
      .pipe(catchError(this.handleError));
  }

  deleteInquerito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(catchError(this.handleError));
  }

  public prepareFormData(inquerito: InqueritoPolicial, arquivo?: File): FormData {
    const formData = new FormData();
    formData.append('inquerito', new Blob([JSON.stringify(inquerito)], { type: 'application/json' }));
    if (arquivo) {
      formData.append('file', arquivo, arquivo.name);
    }
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
