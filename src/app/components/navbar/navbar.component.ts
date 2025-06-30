import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  usuario: string | null = null;

  isLoggedIn(): boolean {
    const logged = this.authService.isLoggedIn();
    if (logged && !this.usuario) {
      this.usuario = this.authService.getUsuario()?.nombreUsuario ?? null;
      console.log('Usuario logueado:', this.usuario);
    }
    return logged;
  }

  logout() {
    this.authService.logout();
    this.usuario = null;
    console.log('Usuario deslogueado');
    this.router.navigate(['/login']);
  }
}
