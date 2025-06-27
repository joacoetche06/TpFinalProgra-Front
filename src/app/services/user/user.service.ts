// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../lib/interfaces';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// src/app/services/user.service.ts
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private modoMock = environment.modoMock;
  private apiUrl = `${environment.apiUrl}/usuarios/my-profile`;

  constructor(private http: HttpClient) {}

  getMiPerfil(): Observable<Usuario> {
    if (this.modoMock) {
      const mockUsuario: Usuario = {
        _id: '123',
        nombre: 'Joaquín Etchegaray',
        nombreUsuario: 'Joacoetche2111',
        email: 'joaco@correo.com',
        imagenPerfilUrl: 'https://via.placeholder.com/150',
      };
      return of(mockUsuario);
    } else {
      return this.http.get<Usuario>(this.apiUrl);
    }
  }
}
