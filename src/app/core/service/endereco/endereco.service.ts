import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: number;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  pais: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cep {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private readonly API_CEP = `${environment.apiUrl}/cep`;
  private readonly API_URL = `${environment.apiUrl}/endereco`;

  constructor(private http: HttpClient) { }

  createEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.API_URL}/create`, endereco);
  }

  getEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.API_URL}/list`);
  }

  getEnderecoById(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.API_URL}/${id}`);
  }

  getEnderecoByCep(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.API_CEP}/${cep}`);
  }

  updateEndereco(id: number, endereco: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(`${this.API_URL}/update/${id}`, endereco);
  }

  deleteEndereco(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

}
