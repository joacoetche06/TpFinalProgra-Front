// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../lib/interfaces';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../../lib/dto/create-user.dto';

// src/app/services/user.service.ts
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private modoMock = environment.modoMock;
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getMiPerfil(): Observable<Usuario> {
    if (this.modoMock) {
      const mockUsuario: Usuario = {
        _id: '123',
        nombre: 'Joaquín Etchegaray',
        nombreUsuario: 'Joacoetche2111',
        correo: 'joaco@correo.com',
        perfil: 'user',

        imagenPerfilUrl: 'https://via.placeholder.com/150',
      };
      return of(mockUsuario);
    } else {
      return this.http.get<Usuario>(`${this.apiUrl}/usuarios/my-profile`);
    }
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  cambiarEstadoUsuario(usuarioId: string, activar: boolean): Observable<any> {
    const accion = activar ? 'alta' : 'baja';
    if (accion === 'alta') {
      return this.http.post(
        `${this.apiUrl}/usuarios/${usuarioId}/reactivar`,
        {},
        {
          headers: this.auth.getAuthHeaders(),
        }
      );
    } else {
      return this.http.delete(`${this.apiUrl}/usuarios/${usuarioId}`, {
        headers: this.auth.getAuthHeaders(),
      });
    }
  }

  registrarUsuario(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formData);
  }
}
