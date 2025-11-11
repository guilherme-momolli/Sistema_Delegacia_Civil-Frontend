import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-forbiden-acess',
  imports: [RouterModule],
  templateUrl: './forbiden-acess.component.html',
  styleUrl: './forbiden-acess.component.css'
})
export class ForbidenAcessComponent {
  constructor(private router: Router) {}
  
    navigateTo(route: string) {
      this.router.navigate([route]);
    }
}
