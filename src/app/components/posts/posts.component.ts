// src/app/components/posts/posts.component.ts
import { Component, OnInit } from '@angular/core';
import { Post } from '../../lib/interfaces';
import { PostService } from '../../services/post/post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Usuario } from '../../lib/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  publicaciones: Post[] = [];
  ordenSeleccionado: 'fecha' | 'likes' = 'fecha';
  paginaActual: number = 1;
  limite: number = 5;
  usuarioActualId: string = 'id_de_usuario';
  hayMasPaginas: boolean = true;
  totalPublicaciones: number = 0;
  modoMock: boolean = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) {}



  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const id = this.authService.getUserId();
      if (id) {
        this.usuarioActualId = id;
        this.cargarPublicaciones();
      } else {
        console.error('ID de usuario no disponible');
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('Usuario no autenticado, redirigiendo...');
      this.router.navigate(['/login']);
    }
  }

  cargarPublicaciones(): void {
    if (this.modoMock) {
    } else {
      this.postService
        .getPublicaciones(
          this.ordenSeleccionado,
          this.paginaActual,
          this.limite
        )
        .subscribe((data: { posts: Post[]; total: number }) => {
          this.publicaciones = data.posts.map((post) => ({
            ...post,
            autor: this.getNombreAutor(post.autor),
          }));
          this.totalPublicaciones = data.total;
          this.hayMasPaginas = data.posts.length === this.limite;
        });
    }
  }

  getNombreAutor(autor: string | Usuario): string {
    if (typeof autor === 'string') {
      return autor;
    }
    return autor.nombreUsuario || 'Anónimo';
  }

  siguientePagina(): void {
    this.paginaActual++;
    this.cargarPublicaciones();
  }

  anteriorPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPublicaciones();
    }
  }

  tieneLike(post: Post): boolean {
    return post.meGusta.includes(this.usuarioActualId);
  }

  toggleLike(post: Post): void {
    const tieneLike = this.tieneLike(post);

    if (this.modoMock) {
      if (tieneLike) {
        post.meGusta = post.meGusta.filter((id) => id !== this.usuarioActualId);
      } else {
        post.meGusta.push(this.usuarioActualId);
      }
    } else {
      const observable = tieneLike
        ? this.postService.unlikePost(post._id)
        : this.postService.likePost(post._id);

      observable.subscribe(() => {
        if (tieneLike) {
          post.meGusta = post.meGusta.filter(
            (id) => id !== this.usuarioActualId
          );
        } else {
          post.meGusta.push(this.usuarioActualId);
        }
      });
    }
  }
}
