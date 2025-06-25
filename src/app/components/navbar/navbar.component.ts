// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    }
    return logged;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
