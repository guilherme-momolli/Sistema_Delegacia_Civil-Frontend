import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/file/v1`;

  constructor(private http: HttpClient) {}

  /**
   * Upload de um único arquivo
   * @param file Arquivo a ser enviado
   * @returns Observable com a resposta do servidor
   */
  uploadFile(file: File): Observable<{ fileName: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ fileName: string; fileUrl: string }>(`${this.apiUrl}/uploadFile`, formData)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Upload de múltiplos arquivos
   * @param files Lista de arquivos a serem enviados
   * @returns Observable com a resposta do servidor
   */
  uploadMultipleFiles(files: File[]): Observable<{ fileName: string; fileUrl: string }[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));

    return this.http.post<{ fileName: string; fileUrl: string }[]>(`${this.apiUrl}/uploadMultipleFiles`, formData)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Download de arquivo pelo nome
   * @param fileName Nome do arquivo no servidor
   * @returns Observable contendo o Blob do arquivo
   */
  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/downloadFile/${fileName}`, { responseType: 'blob' })
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Tratamento de erros HTTP
   * @param error Erro da requisição
   * @returns Observable com erro tratado
   */
  private handleError(error: any): Observable<never> {
    console.error('Erro no FileService:', error);
    return throwError(() => new Error(error.message || 'Erro desconhecido'));
  }
}
