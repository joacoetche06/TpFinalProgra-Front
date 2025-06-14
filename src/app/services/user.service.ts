// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../lib/interfaces';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private modoMock = true;

  constructor(private http: HttpClient) {}

  getMiPerfil(): Observable<Usuario> {
    if (this.modoMock) {
      const mockUsuario: Usuario = {
        _id: '123',
        nombre: 'Joaquín Etchegaray',
        email: 'joaco@correo.com',
        foto: 'https://via.placeholder.com/150',
      };
      return of(mockUsuario);
    } else {
      return this.http.get<Usuario>('/api/usuarios/mi-perfil');
    }
  }
}
