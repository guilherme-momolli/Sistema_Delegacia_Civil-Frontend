import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/file/v1`;

  constructor(private http: HttpClient) { }

  /** Upload de um único arquivo */
  uploadFile(file: File, subFolder?: string): Observable<{ fileName: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (subFolder) {
      formData.append('subFolder', subFolder);
    }

    return this.http.post<{ fileName: string; fileUrl: string }>(`${this.apiUrl}/uploadFile`, formData)
      .pipe(catchError(error => this.handleError(error)));
  }

  /** Upload de múltiplos arquivos */
  uploadMultipleFiles(files: File[], subFolder?: string): Observable<{ fileName: string; fileUrl: string }[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));
    if (subFolder) {
      formData.append('subFolder', subFolder);
    }

    return this.http.post<{ fileName: string; fileUrl: string }[]>(`${this.apiUrl}/uploadMultipleFiles`, formData)
      .pipe(catchError(error => this.handleError(error)));
  }

  /** Download de arquivo pelo nome */
  downloadFile(fileName: string, subFolder?: string): Observable<Blob> {
    let params = new HttpParams();
    if (subFolder) {
      params = params.set('subFolder', subFolder);
    }

    return this.http.get(`${this.apiUrl}/downloadFile/${fileName}`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(error => this.handleError(error)));
  }

  /** Gera URL direta para exibir imagens */
  getImageUrl(subFolder: string, fileName: string): string {
    return `${this.apiUrl}/getFile/Imagens/${subFolder}/${fileName}`;
  }

  /** Tratamento de erros HTTP */
  private handleError(error: any): Observable<never> {
    console.error('Erro no FileService:', error);
    return throwError(() => new Error(error.message || 'Erro desconhecido'));
  }
}
