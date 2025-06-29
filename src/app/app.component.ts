import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    Router,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  mostrarChat = false;
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe((user) => {
      console.log('Usuario actual:', user);
      this.isAuthenticated = !!user;
    });
  }
  title = 'TpFinalEtchegaray-Front';
}
