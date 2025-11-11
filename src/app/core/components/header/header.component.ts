import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../guards/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Privilegio } from '../../enum/usuario/privilegio.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], // <- use CommonModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  usuarioNome: string = '';
  privilegio: Privilegio | null = null;
  nomeDelegacia: string | null = null;
  isDarkMode: boolean = false; 

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.authService.authStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => {
        this.isLoggedIn = isLogged;
        if (isLogged) {
          this.carregarDadosUsuario();
        } else {
          this.resetarDadosUsuario();
        }
      });

    this.aplicarModoEscuro();
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode; // Alterna o estado
    const darkModeAtivo = document.body.classList.toggle('dark-mode', this.isDarkMode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', darkModeAtivo ? 'enabled' : '');
    }
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    const dropdown = (event.currentTarget as HTMLElement).closest('.dropdown');
    const menu = dropdown?.querySelector('.dropdown-menu.show');
    menu?.classList.remove('show');
  }

  private carregarDadosUsuario() {
    this.usuarioNome = this.authService.getUsuarioNome() || 'Usuário';
    this.nomeDelegacia = this.authService.getDelegaciaNome();
    this.privilegio = this.authService.getPrivilegio();
  }

  private resetarDadosUsuario() {
    this.usuarioNome = '';
    this.nomeDelegacia = null;
  }

  private aplicarModoEscuro() {
    if (this.isModoEscuroHabilitado()) {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  temAcessoDelegacia(): boolean {
    return this.privilegio === Privilegio.CONTROLE_MESTRE;
  }

  podeVerListaUsuarios(): boolean {
    return this.privilegio !== Privilegio.USUARIO;
  }

  private isModoEscuroHabilitado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('darkMode') === 'enabled';
    }
    return false;
  }
}