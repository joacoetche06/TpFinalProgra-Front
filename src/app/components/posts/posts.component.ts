// src/app/pages/posts/posts.component.ts
import { Component, OnInit } from '@angular/core';
import { Post } from '../../lib/interfaces';
import { PostService } from '../../services/post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  usuarioActualId: string = 'tu_id_de_usuario'; // esto se debería obtener del token o authService
  hayMasPaginas: boolean = true;

  modoMock: boolean = true; // cambiar a false si querés probar con API real

  constructor(private postService: PostService) {}

  todasLasPublicaciones: Post[] = [
    {
      _id: '1',
      contenido: 'Primer post',
      autor: 'Juan',
      meGusta: ['123', '456'],
      comentarios: [
        { autor: 'Ana', texto: 'Muy bueno' },
        { autor: 'Pedro', texto: 'Gracias por compartir' },
      ],
      createdAt: '2025-06-13T10:00:00.000Z',
    },
    {
      _id: '2',
      contenido: 'Segundo post',
      autor: 'Maria',
      meGusta: ['456'],
      comentarios: [],
      createdAt: '2025-06-14T12:00:00.000Z',
    },
    {
      _id: '3',
      contenido: 'Otro post más',
      autor: 'Joaquin',
      meGusta: [],
      comentarios: [],
      createdAt: '2025-06-12T09:00:00.000Z',
    },
    {
      _id: '4',
      contenido: 'Primer post',
      autor: 'Juan',
      meGusta: ['123', '456'],
      comentarios: [
        { autor: 'Ana', texto: 'Muy bueno' },
        { autor: 'Pedro', texto: 'Gracias por compartir' },
      ],
      createdAt: '2025-06-13T10:00:00.000Z',
    },
    {
      _id: '5',
      contenido: 'Segundo post',
      autor: 'Maria',
      meGusta: ['456'],
      comentarios: [],
      createdAt: '2025-06-14T12:00:00.000Z',
    },
    {
      _id: '6',
      contenido: 'Otro post más',
      autor: 'Joaquin',
      meGusta: [],
      comentarios: [],
      createdAt: '2025-06-12T09:00:00.000Z',
    },
    {
      _id: '7',
      contenido: 'Primer post',
      autor: 'Juan',
      meGusta: ['123', '456'],
      comentarios: [
        { autor: 'Ana', texto: 'Muy bueno' },
        { autor: 'Pedro', texto: 'Gracias por compartir' },
      ],
      createdAt: '2025-06-13T10:00:00.000Z',
    },
    {
      _id: '8',
      contenido: 'Segundo post',
      autor: 'Maria',
      meGusta: ['456'],
      comentarios: [],
      createdAt: '2025-06-14T12:00:00.000Z',
    },
    {
      _id: '9',
      contenido: 'Otro post más',
      autor: 'Joaquin',
      meGusta: [],
      comentarios: [],
      createdAt: '2025-06-12T09:00:00.000Z',
    },
    // ... agregá más si querés probar la paginación
  ];

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    if (this.modoMock) {
      console.log('hola');
      let publicacionesOrdenadas = [...this.todasLasPublicaciones];

      if (this.ordenSeleccionado === 'fecha') {
        publicacionesOrdenadas.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (this.ordenSeleccionado === 'likes') {
        publicacionesOrdenadas.sort(
          (a, b) => b.meGusta.length - a.meGusta.length
        );
      }

      const inicio = (this.paginaActual - 1) * this.limite;
      const fin = inicio + this.limite;
      this.publicaciones = publicacionesOrdenadas.slice(inicio, fin);
      this.hayMasPaginas = publicacionesOrdenadas.length > fin;
    } else {
      this.postService
        .getPublicaciones(
          this.ordenSeleccionado,
          this.paginaActual,
          this.limite
        )
        .subscribe((data: Post[]) => {
          this.publicaciones = data;
          this.hayMasPaginas = data.length === this.limite;
        });
    }
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
