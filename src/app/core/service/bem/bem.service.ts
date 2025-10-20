import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BemResponseDTO } from '../../models/dto/bem/bem-response.dto';
import { BemRequestDTO } from '../../models/dto/bem/bem-request.dto';

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
}