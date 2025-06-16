import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // o el prefijo real de tus rutas
  private modoMock = false;
  constructor(private http: HttpClient) {}

  login(usernameOrEmail: string, password: string) {
    if (this.modoMock) {
      // Modo simulado
      if (
        (usernameOrEmail === 'admin' ||
          usernameOrEmail === 'admin@correo.com') &&
        password === 'Admin123'
      ) {
        const mockedUser = {
          nombreUsuario: 'admin',
          rol: 'admin',
          token: 'mocked-jwt',
        };
        localStorage.setItem('usuario', JSON.stringify(mockedUser));
        return Promise.resolve(mockedUser);
      } else {
        return Promise.reject('Usuario o contraseña incorrectos');
      }
    } else {
      // Modo real
      return this.http
        .post<any>(`${this.apiUrl}/auth/login`, {
          nombreUsuarioOEmail: usernameOrEmail,
          password,
        })
        .toPromise()
        .then((res) => {
          localStorage.setItem('usuario', JSON.stringify(res.data));
          localStorage.setItem('token', res.access_token);
          return res;
        });
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
