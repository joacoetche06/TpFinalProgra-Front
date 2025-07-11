import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { ComentarioService } from '../../services/post/comentario.service';
import { CommonModule, Location } from '@angular/common';
import { Post, Comentario } from '../../lib/interfaces'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.css'],
})
export class PostContentComponent implements OnInit {
  postId: string;
  post: any;
  comentarios: any[] = [];
  offset = 0;
  limit = 3;
  hayMasComentarios = true;
  nuevoComentario = '';
  usuarioActual: any;
  imageError = false;
  readonly API_URL = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private comentarioService: ComentarioService,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.usuarioActual = user;
      },
      error: (err) => {
        console.error('Error obteniendo usuario actual:', err);
        this.router.navigate(['/login']);
      },
    });

    this.postService.getPostById(this.postId).subscribe({
      next: (p: Post) => {
        this.post = p;
        console.log('Publicación cargada:', this.post);
      },
      error: (err) => {
        console.error('Error al obtener publicación:', err);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });

    this.cargarComentarios();
  }

  cargarComentarios() {
    if (!this.hayMasComentarios) return;

    this.comentarioService
      .getComentarios(this.postId, this.offset, this.limit)
      .subscribe({
        next: (resp: any) => {
          const nuevosComentarios = resp.comentarios.map((c: any) => ({
            ...c,
            editando: false,
            editText: c.texto,
          }));

          this.comentarios = [...this.comentarios, ...nuevosComentarios];
          this.offset += resp.comentarios.length;
          this.hayMasComentarios = this.offset < resp.total;
          console.log('Comentarios cargados:', this.comentarios);
          console.log('Usuario actual:', this.usuarioActual);
        },
        error: (err) => {
          console.error('Error al obtener comentarios:', err);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  iniciarEdicion(comentario: any) {
    console.log('Autor del comentario:', comentario.autor);

    comentario.editando = true;
    comentario.editText = comentario.texto; 
  }

  guardarEdicion(comentario: any) {
    const nuevoTexto = comentario.editText.trim();
    console.log(
      'Guardando edición para comentario:',
      comentario._id,
      'Nuevo texto:',
      nuevoTexto
    );
    if (nuevoTexto && nuevoTexto !== comentario.texto) {
      this.comentarioService
        .modificarComentario(comentario._id, nuevoTexto)
        .subscribe({
          next: (comentarioActualizado: Comentario) => {
            comentario.texto = comentarioActualizado.texto;
            comentario.modificado = comentarioActualizado.modificado;
            comentario.editando = false;
            comentario.autor = comentarioActualizado.autor; 
            console.log('Comentario actualizado:', comentario);
          },
          error: (err) => {
            console.error('Error al actualizar comentario:', err);
            comentario.editText = comentario.texto;
          },
        });
    } else {
      comentario.editando = false;
    }
  }

  agregarComentario() {
    if (this.nuevoComentario.trim()) {
      this.comentarioService
        .agregarComentario(this.postId, this.nuevoComentario.trim())
        .subscribe({
          next: (nuevoComent: any) => {
            console.log('Nuevo comentario agregado:', nuevoComent);
            this.comentarios.unshift({
              ...nuevoComent,
              editando: false,
              editText: nuevoComent.texto,
            });
            console.log('Comentarios actualizados:', this.comentarios);
            this.nuevoComentario = '';
          },
          error: (err) => {
            console.error('Error al agregar comentario:', err);
            if (err.status === 401) this.router.navigate(['/login']);
          },
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
      : `${this.API_URL}${imagePath}`;
  }

  tieneLike(): boolean {
    return this.post?.meGusta?.includes(this.usuarioActual?._id);
  }

  toggleLike(): void {
    if (!this.usuarioActual || !this.post) return;

    const yaLeDioLike = this.tieneLike();

    const observable = yaLeDioLike
      ? this.postService.unlikePost(this.post._id)
      : this.postService.likePost(this.post._id);

    observable.subscribe({
      next: () => {
        if (yaLeDioLike) {
          this.post.meGusta = this.post.meGusta.filter(
            (id: string) => id !== this.usuarioActual._id
          );
        } else {
          this.post.meGusta.push(this.usuarioActual._id);
        }
      },
      error: (err) => {
        console.error('Error al modificar like:', err);
        if (err.status === 401) this.router.navigate(['/login']);
      },
    });
  }

  volverAtras() {
    this.location.back();
  }
}
