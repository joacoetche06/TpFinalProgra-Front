import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './components/modal/create-post/create-post.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    // Router,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  mostrarChat = false;
  isAuthenticated = false;

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.isAuthenticated = this.authService.isLoggedIn();
    console.log('Estado de autenticación inicial:', this.isAuthenticated);
    // Suscribirse a cambios
    this.authService.authStatus$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
      console.log('Estado de autenticación actualizado:', this.isAuthenticated);
    });
  }
  title = 'TpFinalEtchegaray-Front';

  abrirCrearPost() {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((publicacionCreada) => {
      if (publicacionCreada) {
        // Notificá a PostsComponent para recargar (ej: EventEmitter, servicio compartido o localStorage flag)
        window.dispatchEvent(new Event('publicacion-creada'));
      }
    });
  }
}
