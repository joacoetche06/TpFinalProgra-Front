import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, Post } from '../../lib/interfaces';
import { UserService } from '../../services/user/user.service';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, MatIconModule], // Añade MatIconModule aquí
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyProfileComponent implements OnInit {
  modoMock = false;
  usuario: Usuario | null = null;
  publicaciones: Post[] = [];
  showDefaultIcon = false;
  readonly API_URL = 'http://localhost:3000';
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
    }
  }

  private loadMockData(): void {
    this.usuario = {
      _id: '123',
      nombre: 'Joaquín',
      nombreUsuario: 'Joacoetche',
      email: 'joaco@correo.com',
      imagenPerfilUrl: '/favicon2.png',
    };

    this.publicaciones = this.getMockPosts();
  }

  private loadRealData(): void {
    this.userService.getMiPerfil().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });

    const userId = this.authService.getUserId();
    console.log('ID de usuario:', userId);
    if (userId) {
      this.postService.getPostsByUser(userId, 3).subscribe((response) => {
        this.publicaciones = response.posts;
        console.log('PPublicaciones obtenidos:', this.publicaciones);
      });
    }
  }

  private getMockPosts(): Post[] {
    return [
      {
        _id: '1',
        descripcion: 'Mi primer post',
        autor: 'Joaquín',
        meGusta: ['123'],
        comentarios: [
          { autor: 'Ana', texto: 'Genial!' },
          { autor: 'Pia', texto: 'Que bueno!' },
        ],
        createdAt: '2025-06-13T10:00:00Z',
      },
      {
        _id: '2',
        descripcion: 'Otro más',
        autor: 'Joaquín',
        meGusta: [],
        comentarios: [],
        createdAt: '2025-06-12T09:00:00Z',
      },
      {
        _id: '3',
        descripcion: 'Último post',
        autor: 'Joaquín',
        meGusta: [],
        comentarios: [
          { autor: 'Ana', texto: 'Genial!' },
          { autor: 'Pia', texto: 'Que bueno!' },
        ],
        createdAt: '2025-06-11T08:00:00Z',
      },
      {
        _id: '4',
        descripcion: 'Este no se ve',
        autor: 'Joaquín',
        meGusta: [],
        comentarios: [],
        createdAt: '2025-06-10T07:00:00Z',
      },
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      this.imageError = true;
      return '';
    }
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.API_URL}${imagePath}`;
  }

  handleImageError(): void {
    this.showDefaultIcon = true;
  }
}
