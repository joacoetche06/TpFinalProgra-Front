import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private modoMock = environment.modoMock;
  private apiUrl = `${environment.apiUrl}/usuarios/my-profile`;

  getPostsPorUsuario(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/posts-por-usuario`, {
      headers: this.auth.getAuthHeaders(),
      params: { desde, hasta },
    });
  }

  getComentariosPorUsuario(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/comentarios-por-usuario`, {
      headers: this.auth.getAuthHeaders(),
      params: { desde, hasta },
    });
  }

  getComentariosPorPublicacion(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/comentarios-por-publicacion`, {
      headers: this.auth.getAuthHeaders(),
      params: { desde, hasta },
    });
  }
}
