import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: number;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  pais: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private readonly API_URL = `${environment.apiUrl}/endereco`;

  constructor(private http: HttpClient) {}

  createEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.API_URL}/create`, endereco);
  }

  getEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.API_URL}/list`);
  }

  getEnderecoById(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.API_URL}/${id}`);
  }
}
