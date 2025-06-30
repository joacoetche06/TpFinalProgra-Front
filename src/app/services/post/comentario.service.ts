import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../../lib/interfaces';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getComentarios(
    postId: string,
    offset: number,
    limit: number
  ): Observable<{ comentarios: Comentario[]; total: number }> {
    return this.http.get<{ comentarios: Comentario[]; total: number }>(
      `${this.apiUrl}/${postId}/comments`,
      {
        params: { offset, limit },
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  agregarComentario(postId: string, texto: string) {
    return this.http.post(`${this.apiUrl}/${postId}/comments`, { texto });
  }

  modificarComentario(
    comentarioId: string,
    texto: string
  ): Observable<Comentario> {
    return this.http.put<Comentario>(
      `${this.apiUrl}/comments/${comentarioId}`,
      { texto }
    );
  }

  getComentarioById(id: string): Observable<Comentario> {
    return this.http.get<Comentario>(`/comments/${id}`);
  }
}
