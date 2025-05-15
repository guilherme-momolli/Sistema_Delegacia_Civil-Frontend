import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl + '/usuario';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getUsuarios(): Observable<any[]>{
    return this.http.get<any[]>(`${this.API_URL}/list`);
  }

  createUsuario(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/create`, userData);
  }

}
