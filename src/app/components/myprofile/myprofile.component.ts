import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, Post } from '../../lib/interfaces';
import { UserService } from '../../services/user/user.service';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyProfileComponent implements OnInit {
  private modoMock = environment.modoMock;
  private apiUrl = environment.apiUrl;
  usuario: Usuario | null = null;
  publicaciones: Post[] = [];
  showDefaultIcon = false;
  imageError = false;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.modoMock) {
      this.loadMockData();
    } else {
      this.loadRealData();
      window.addEventListener('publicacion-creada', () => {
          this.loadRealData();
        });
    }
  }

  private loadMockData(): void {
    this.usuario = {
      _id: '123',
      nombre: 'Joaquín',
      nombreUsuario: 'Joacoetche',
      correo: 'joaco@correo.com',
      imagenPerfilUrl: '/favicon2.png',
          perfil: 'user',

    };
  }

  private loadRealData(): void {
    this.userService.getMiPerfil().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log('Usuario front:', this.usuario);
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });

    const userId = this.authService.getUserId();
    if (userId) {
      this.postService.getPostsByUser(userId, 3).subscribe((response) => {
        this.publicaciones = response.posts;
      });
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      this.imageError = true;
      return '';
    }
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.apiUrl}${imagePath}`;
  }

  handleImageError(): void {
    this.showDefaultIcon = true;
  }

  verPost(postId: string): void {
    this.router.navigate(['/posts', postId]);
  }

formatFecha(fecha: string | Date): string {
  if (!fecha) return 'No disponible';
  
  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  };
  
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}
}
