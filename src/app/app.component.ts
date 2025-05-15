import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../components/assets/header/header.component";
import { AuthService } from '../core/service/auth/auth.service'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'sistema_delegacia_civil';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aplica dark mode
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
      }
    }

    // Log da instituição logada
    const instituicao = this.authService.getInstituicaoNome();
    console.log('Instituição logada:', instituicao);
  }

  toggleDarkMode() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.removeItem('darkMode');
      }
    }
  }
}
