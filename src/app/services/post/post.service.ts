// src/app/services/post.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../lib/interfaces';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPublicaciones(
    sortBy: 'fecha' | 'likes',
    page: number = 1,
    limit: number = 5
  ): Observable<{ posts: Post[]; total: number }> {
    const offset = (page - 1) * limit;
    const params = new HttpParams()
      .set('sort', sortBy)
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('includeComments', 'true'); // Nuevo parámetro

    return this.http.get<{ posts: Post[]; total: number }>(this.apiUrl, {
      params,
      headers: this.authService.getAuthHeaders(),
    });
  }

  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }

  unlikePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}/like`);
  }

  getMisPublicaciones(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}?limit=3`);
  }

  getPostsByUser(
    userId: string,
    cantidad: number
  ): Observable<{ posts: Post[]; total: number }> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('sort', 'fecha')
      .set('offset', '0')
      .set('limit', cantidad.toString())
      .set('includeComments', 'true'); // <--- clave para incluir comentarios

    return this.http.get<{ posts: Post[]; total: number }>(`${this.apiUrl}`, {
      params,
      headers: this.authService.getAuthHeaders(),
    });
  }

  getPostById(id: string) {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(), // Necesitarás inyectar AuthService o crear un método similar
    });
  }
}
