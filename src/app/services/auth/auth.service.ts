import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private modoMock = false;

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(usernameOrEmail: string, password: string) {
    if (this.modoMock) {
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

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // 🔽 MÉTODO NUEVO: obtener el ID desde el JWT
  getUserId(): string | null {
    const usuario = this.getUsuario();
    return usuario && usuario._id ? usuario._id : null;
  }
}
