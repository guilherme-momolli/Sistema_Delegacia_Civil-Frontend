import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegioGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const privilegiosPermitidos = route.data['privilegios'] as string[];
    const privilegioUsuario = this.authService.getPrivilegio();
  
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
