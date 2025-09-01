import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../guards/auth/auth.service';

export interface User {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  delegacia: { id: number };
  privilegio: string;
}

export interface CadastroUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  delegaciaId: number;
  privilegio: string;
}
export interface DelegaciaDTO {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
}

export interface AuthRequestDTO {
  email: string;
  senha: string;
}

export interface AuthResponseDTO {
  token: string | null;
  delegacias: DelegaciaDTO[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}`;
  private usuarioUrl = `${this.apiUrl}/usuario`;
  private authUrl = `${this.apiUrl}/auth`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usuarioUrl}/list`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  getUsuarioByDelegacia(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.usuarioUrl}/delegacia/${id}`, {
      headers: this.auth.getAuthHeaders()
    });
  }


  getUsuarioById(id: number): Observable<User> {
    return this.http.get<User>(`${this.usuarioUrl}/list/${id}`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }

  createUsuario(userData: CadastroUsuarioRequest): Observable<User> {
    return this.http.post<User>(`${this.usuarioUrl}/create`, userData, {
      headers: this.auth.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro no serviço de usuário', error);
        return throwError(() => error);
      })
    );
  }

  updateUsuario(id: number, usuario: User): Observable<User> {
    return this.http.put<User>(`${this.usuarioUrl}/update/${id}`, usuario, {
      headers: this.auth.getAuthHeaders()
    });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuarioUrl}/delete/${id}`, {
      headers: this.auth.getAuthHeaders()
    });
  }
}
