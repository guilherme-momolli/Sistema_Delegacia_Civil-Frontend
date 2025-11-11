import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Privilegio } from '../../enum/usuario/privilegio.enum';

@Injectable({
  providedIn: 'root'
})
export class PrivilegioGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const privilegiosPermitidos: Privilegio[] = (route.data['privilegios'] || []) as Privilegio[];
    const privilegioUsuario: Privilegio | null = this.authService.getPrivilegio();

    if (!privilegioUsuario) {
      this.router.navigate(['/login']);
      return false;
    }

    if (privilegiosPermitidos.includes(privilegioUsuario)) {
      return true;
    }

    this.router.navigate(['/acesso-negado']);
    return false;
  }
}