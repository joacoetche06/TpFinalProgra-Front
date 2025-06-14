// src/app/services/post.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../lib/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getPublicaciones(
    sortBy: 'fecha' | 'likes',
    page: number = 1,
    limit: number = 5
  ): Observable<Post[]> {
    const params = new HttpParams()
      .set('sort', sortBy)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Post[]>(this.apiUrl, { params });
  }

  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }

  unlikePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}/unlike`);
  }

  getMisPublicaciones(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}?limit=3`);
  }
}
