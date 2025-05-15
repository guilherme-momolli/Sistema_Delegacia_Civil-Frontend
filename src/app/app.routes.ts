import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LandingPageComponent } from '../components/pages/landing-page/landing-page.component';
import { NotFoundComponent } from '../components/pages/not-found/not-found.component';
import { InstituicaoComponent } from '../components/pages/instituicao/instituicao.component';
import { MainComponent } from '../components/pages/main/main.component';
import { ContatoComponent } from '../components/pages/contato/contato.component';
import { InqueritoPolicialComponent } from '../components/pages/inquerito-policial/inquerito-policial.component';
import { BoletimOcorrenciaComponent } from '../components/pages/boletim-ocorrencia/boletim-ocorrencia.component';
import { UsuarioComponent } from '../components/pages/usuario/usuario.component';
import { NoAuthGuard } from '../core/service/auth/no-auth.guard';
import { AuthGuard } from '../core/service/auth/auth.guard';
import { PrivilegioGuard } from '../core/service/auth/privlegio.guard';

export const routes: Routes = [
  //SEM LOGIN
  { path: '', component: LandingPageComponent, canActivate: [NoAuthGuard] },
  { path: 'signup', component: InstituicaoComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  //COM LOGIN
  { path: 'inquerito-policial', component: InqueritoPolicialComponent, canActivate: [AuthGuard] },
  { path: 'boletim-ocorrencia', component: BoletimOcorrenciaComponent, canActivate: [AuthGuard] },
  //ADIMIN
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard, PrivilegioGuard], data: { privilegios: ['Administrador', 'Administrador master', 'Controle Mestre'] }},
  //COM SE SEM LOGIN
  { path: 'contato', component: ContatoComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }