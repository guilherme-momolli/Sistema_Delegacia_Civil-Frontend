import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../service/storage/storage.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Privilegio } from '../../enum/usuario/privilegio.enum';

interface AuthRequestDTO {
  email: string;
  senha: string;
}

interface AuthResponseDTO {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    this.authStatus.next(this.tokenExiste());
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(request: AuthRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        if (response.token) {
          this.salvarToken(response.token);
          this.storage.setItem('email', request.email);

          const decoded = this.decodeToken();
          this.storage.setItem('usuarioNome', decoded.usuarioNome);
          this.storage.setItem('delegaciaId', decoded.delegaciaId.toString());
          this.storage.setItem('delegaciaNome', decoded.delegaciaNome);
          this.storage.setItem('privilegio', decoded.privilegio);
          console.log('Delegacia ID:', decoded.delegaciaId);
          this.authStatus.next(true);
        }
      })
    )
  }

  logout(): void {
    this.storage.removeItem('authToken');
    this.storage.removeItem('delegaciaId');
    this.storage.removeItem('delegaciaNome');
    this.storage.removeItem('usuarioNome');
    this.storage.removeItem('email');
    this.storage.removeItem('privilegio')
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token não encontrado!');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  public getToken(): string | null {
    return this.storage.getItem<string>('authToken');
  }

  public getUsuarioNome(): string | null {
    const decoded = this.decodeToken();
    return decoded?.usuarioNome || null;
  }

  public getDelegaciaId(): number | null {
    const decoded = this.decodeToken();
    return decoded?.delegaciaId || null;
  }

  public getDelegaciaNome(): string | null {
    const decoded = this.decodeToken();
    return decoded?.delegaciaNome || null;
  }

  public getPrivilegio(): Privilegio | null {
    const decoded = this.decodeToken();
    const privilegioStr = decoded?.privilegio;

    if (!privilegioStr || typeof privilegioStr !== 'string') {
      return null;
    }

    if (Object.values(Privilegio).includes(privilegioStr as Privilegio)) {
      return privilegioStr as Privilegio;
    }

    console.warn('Privilégio inválido no token:', privilegioStr);
    return null;
  }



  public getEmail(): string | null {
    return this.storage.getItem<string>('email');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch (e) {
      return false;
    }
  }

  public salvarToken(token: string): void {
    this.storage.setItem('authToken', token);
    this.authStatus.next(true);
  }

  private tokenExiste(): boolean {
    try {
      return this.isBrowser() && !!this.getToken();
    } catch (e) {
      console.error('Erro ao verificar token existente:', e);
      return false;
    }
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erro ao decodificar token JWT:', error);
      return null;
    }
  }
}
