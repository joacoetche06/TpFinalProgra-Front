import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { ComentarioService } from '../../services/post/comentario.service';
import { CommonModule } from '@angular/common';
import { Post, Comentario } from '../../lib/interfaces'; // Asegúrate de tener la interfaz Comentario
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Necesitarás el servicio de autenticación
import { FormsModule } from '@angular/forms'; // Para usar ngModel

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agrega FormsModule aquí
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
  usuarioActual: any; // Almacenará la información del usuario logueado
  imageError = false;
  readonly API_URL = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private comentarioService: ComentarioService,
    private router: Router,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    // Obtener usuario actual
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.usuarioActual = user;
      },
      error: (err) => {
        console.error('Error obteniendo usuario actual:', err);
        this.router.navigate(['/login']);
      }
    });

    // Cargar publicación
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
      }
    });

    this.cargarComentarios();
  }

  cargarComentarios() {
    if (!this.hayMasComentarios) return;

    this.comentarioService
      .getComentarios(this.postId, this.offset, this.limit)
      .subscribe({
        next: (resp: any) => {
          // Inicializar propiedades para edición
          const nuevosComentarios = resp.comentarios.map((c: any) => ({
            ...c,
            editando: false,
            editText: c.texto
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

  // Función para iniciar la edición de un comentario
  iniciarEdicion(comentario: any) {
    console.log('Autor del comentario:', comentario.autor);

    comentario.editando = true;
    comentario.editText = comentario.texto; // Copiar el texto actual para editar
  }

  // Función para guardar los cambios de un comentario editado
  guardarEdicion(comentario: any) {
    const nuevoTexto = comentario.editText.trim();
    console.log('Guardando edición para comentario:', comentario._id, 'Nuevo texto:', nuevoTexto);
    if (nuevoTexto && nuevoTexto !== comentario.texto) {
      this.comentarioService.modificarComentario(comentario._id, nuevoTexto)
        .subscribe({
          next: (comentarioActualizado: Comentario) => {
            // Actualizar el comentario en la lista
            comentario.texto = comentarioActualizado.texto;
            comentario.modificado = comentarioActualizado.modificado;
            comentario.editando = false;
          },
          error: (err) => {
            console.error('Error al actualizar comentario:', err);
            // Revertir cambios en caso de error
            comentario.editText = comentario.texto;
          }
        });
    } else {
      // Cancelar si no hay cambios
      comentario.editando = false;
    }
  }

  // Función para agregar un nuevo comentario
  agregarComentario() {
    if (this.nuevoComentario.trim()) {
      this.comentarioService.agregarComentario(this.postId, this.nuevoComentario.trim())
        .subscribe({
          next: (nuevoComent: any) => {
            // Agregar el nuevo comentario al principio de la lista
            this.comentarios.unshift({
              ...nuevoComent,
              editando: false,
              editText: nuevoComent.texto
            });
            this.nuevoComentario = '';
          },
          error: (err) => {
            console.error('Error al agregar comentario:', err);
            if (err.status === 401) this.router.navigate(['/login']);
          }
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

}