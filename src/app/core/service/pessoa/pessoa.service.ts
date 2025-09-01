import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UF } from '../../enum/endereco/uf.enum';
import { Page } from '../../../models/page/page.model';


export interface Pessoa {
  id?: number;
  imagemUrl?: string;
  nome: string;
  nomeSocial?: string;
  dataNascimento?: string;
  sexo?: string;
  cpf?: string;
  rg?: string;
  telefoneFixo?: string;
  telefoneCelular?: string;
  email?: string;
  estadoCivil?: string;
  profissao?: string;
  nacionalidade?: string;
  naturalidade?: string;
  certificadoRegistro?: string;
  etnia?: string;
  situacaoPessoa?: string;
  endereco?: number;
  descricao?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private apiUrl = `${environment.apiUrl}/pessoa`;

  constructor(private http: HttpClient) { }

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/list`).pipe(catchError(this.handleError));
  }

  getUfName(sigla: keyof typeof UF): string {
    return UF[sigla];
  }


  getPessoasFiltradas(filtro: any, page: number = 0, size: number = 10): Observable<Page<Pessoa>> {
    const params: any = {
      page: page.toString(),
      size: size.toString(),
      ...filtro
    };

    return this.http.get<Page<Pessoa>>(`${this.apiUrl}/search`, { params }).pipe(
      tap(response => {
        console.log('📌 Retorno da API (getPessoasFiltradas):', response);
      }),
      catchError(this.handleError)
    );
  }




  getPessoaById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/getById/${id}`).pipe(catchError(this.handleError));
  }

  createPessoa(pessoa: Pessoa, imagem?: File): Observable<Pessoa> {
    const formData = this.prepareFormData(pessoa, imagem);
    return this.http.post<Pessoa>(`${this.apiUrl}`, formData).pipe(catchError(this.handleError));
  }

  updatePessoa(id: number, pessoa: Pessoa, imagem?: File): Observable<Pessoa> {
    const formData = this.prepareFormData(pessoa, imagem);
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, formData).pipe(catchError(this.handleError));
  }

  deletePessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private prepareFormData(pessoa: Pessoa, imagem?: File): FormData {
    const formData = new FormData();
    formData.append('pessoa', new Blob([JSON.stringify(pessoa)], { type: 'application/json' }));
    if (imagem) {
      formData.append('imagem', imagem);
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