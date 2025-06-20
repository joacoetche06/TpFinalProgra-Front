// src/app/services/post.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../lib/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

getPublicaciones(
  sortBy: 'fecha' | 'likes',
  page: number = 1, // Cambiar a página en lugar de offset
  limit: number = 5
): Observable<{ posts: Post[]; total: number }> {
  const offset = (page - 1) * limit; // Calcular offset internamente
  const params = new HttpParams()
    .set('sort', sortBy)
    .set('offset', offset.toString())
    .set('limit', limit.toString());

  return this.http.get<{ posts: Post[]; total: number }>(this.apiUrl, { params });
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

  getPostsByUser(userId: string, cantidad: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, {
      params: {
        userId,
        sort: 'fecha',
        offset: 0,
        limit: cantidad.toString(),
      },
    });
  }
}
