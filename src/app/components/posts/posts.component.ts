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
import { UsuarioPipe } from '../../pipes/usuario.pipe';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component'; // ajustá el path

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioPipe],
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
  imageError = false;
  private modoMock = environment.modoMock;
  private API_URL = environment.apiUrl;

usuarioActual: any;

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  if (this.authService.isLoggedIn()) {
    this.authService.getCurrentUser().subscribe((usuario) => {
      if (usuario) {
        this.usuarioActual = usuario;
        this.usuarioActualId = usuario._id;
        this.cargarPublicaciones();

        window.addEventListener('publicacion-creada', () => {
          this.cargarPublicaciones();
        });
      } else {
        console.error('No se pudo obtener el usuario');
        this.router.navigate(['/login']);
      }
    });
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
            autor: post.autor,
          }));
          console.log('Publicaciones cargadas:', this.publicaciones);
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

  verPost(postId: string): void {
    this.router.navigate(['/posts', postId]);
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

  eliminarPublicacion(postId: string) {
  const dialogRef = this.dialog.open(ModalComponent, {
    width: '400px',
    data: {
      message: '¿Estás seguro de que querés eliminar esta publicación?'
    }
  });

  dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    if (confirmado) {
      this.postService.eliminarPost(postId).subscribe({
        next: () => this.cargarPublicaciones(),
        error: (err) => {
          console.error('Error al eliminar publicación', err);
          alert('No se pudo eliminar la publicación');
        }
      });
    }
  });
}



esUsuarioAutor(autor: string | Usuario): boolean {
  return this.usuarioActual?._id === (autor as Usuario)._id;
}

isAdmin(): boolean {
  return this.usuarioActual?.perfil === 'admin';
}


}
