import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private modoMock = true;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (this.isBrowser()) {
      this.token = localStorage.getItem('token');
      const userData = localStorage.getItem('usuario');
      this.usuario = userData ? JSON.parse(userData) : null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private token: string | null = null;
  private usuario: any = null;

  async login(usernameOrEmail: string, password: string) {
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
          if (this.isBrowser()) {
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('usuario', JSON.stringify(res.data));
          }
          this.token = res.access_token;
          this.usuario = res.data;
          console.log('Login exitoso. Token:', res.access_token);
          return res;
        });
    }
  }

  register(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getToken(): string | null {
    return this.token;
  }

  getUsuario(): any {
    return this.usuario;
  }

  getUserId(): string | null {
    return this.usuario?._id || null;
  }

  isLoggedIn(): boolean {
    return !!this.token && !this.isTokenExpired(this.token);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
    this.token = null;
    this.usuario = null;
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  async waitForAuthInit(): Promise<void> {
    if (this.isBrowser() && localStorage.getItem('token')) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
