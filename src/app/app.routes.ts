import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom, NgModule } from '@angular/core';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
// import { InstituicaoComponent } from '../components/pages/instituicao/instituicao.component';
import { MainComponent } from './pages/main/main.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { InqueritoPolicialComponent } from './pages/inquerito-policial/inquerito-policial.component';
import { BoletimOcorrenciaComponent } from './pages/boletim-ocorrencia/boletim-ocorrencia.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { NoAuthGuard } from './core/guards/auth/no-auth.guard'; 
import { AuthGuard } from './core/guards/auth/auth.guard'; 
import { PrivilegioGuard } from './core/guards/auth/privlegio.guard'; 
import { DelegaciaComponent } from './pages/delegacia/delegacia.component';
import { DebugComponent } from './pages/debug/debug.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PessoaComponent } from './pages/pessoa/pessoa.component';

export const routes: Routes = [
  { path: 'debug', component: DebugComponent },
  { path: '', component: LandingPageComponent, canActivate: [NoAuthGuard] },
  // { path: 'signup', component: InstituicaoComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, /*canActivate: [NoAuthGuard]*/ },
  { path: 'main', component: MainComponent, /*canActivate: [AuthGuard]*/ },
  { path: 'inquerito-policial', component: InqueritoPolicialComponent, /*canActivate: [AuthGuard]*/ },
  { path: 'pessoa', component: PessoaComponent},
  { path: 'boletim-ocorrencia', component: BoletimOcorrenciaComponent, canActivate: [AuthGuard] },
  { path: 'delegacia', component: DelegaciaComponent, /*canActivate: [AuthGuard, PrivilegioGuard],*/ data: { privilegios: ['Administrador', 'Administrador master', 'Controle Mestre'] }},
  { path: 'usuario', component: UsuarioComponent, /*canActivate: [AuthGuard, PrivilegioGuard],*/  data: { privilegios: ['Administrador', 'Administrador master', 'Controle Mestre'] }},
  { path: 'contato', component: ContatoComponent },
  { path: 'my-profile', component: MyProfileComponent, /*canActivate: [AuthGuard]*/},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }