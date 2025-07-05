import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from '../../lib/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuario: Usuario | null = null;
  private modoMock = environment.modoMock;
  private apiUrl = environment.apiUrl;
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initializeAuthState() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('usuario');
      this.usuario = userData ? JSON.parse(userData) : null;

      if (token && this.isTokenExpired(token)) {
        this.logout();
      }
    }
  }

  async login(usernameOrEmail: string, password: string) {
    let response;
    try {
      if (this.modoMock) {
        if (
          (usernameOrEmail === 'admin' ||
            usernameOrEmail === 'admin@correo.com') &&
          password === 'Admin123'
        ) {
          const mockedUser: Usuario = {
            _id: '1',
            nombre: 'Admin',
            nombreUsuario: 'admin',
            correo: 'admin@correo.com',
            perfil: 'user',
          };
          const token = 'mocked-jwt';
          localStorage.setItem('usuario', JSON.stringify(mockedUser));
          localStorage.setItem('token', token);
          this.usuario = mockedUser;
          return { user: mockedUser, access_token: token };
        } else {
          return Promise.reject('Usuario o contraseña incorrectos');
        }
      } else {
        response = await this.http
          .post<any>(`${this.apiUrl}/auth/login`, {
            nombreUsuarioOEmail: usernameOrEmail,
            password,
          })
          .toPromise();

        if (this.isBrowser()) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('usuario', JSON.stringify(response.user));
        }
        this.usuario = response.user;
        this.authStatus.next(true);
      }
      return response;
    } catch (error) {
      this.authStatus.next(false);
      throw error;
    }
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
    this.usuario = null;
    this.authStatus.next(false);
  }

  getCurrentUser(): Observable<any> {
    if (!this.isLoggedIn()) {
      return of(null);
    }

    return this.http
      .get(`${this.apiUrl}/auth/current-user`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.logout();
          }
          return throwError(error);
        })
      );
  }

  getCurrentUserSync(): Usuario | null {
    if (!this.usuario && this.isBrowser()) {
      const userData = localStorage.getItem('usuario');
      this.usuario = userData ? JSON.parse(userData) : null;
    }
    return this.usuario;
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  register(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  isTokenExpired(token: string | null = this.getToken()): boolean {
    if (!token) return true;
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getUsuario(): Usuario | null {
    return this.usuario;
  }

  getUserId(): string | null {
    return this.usuario?._id || null;
  }

  setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
    if (this.isBrowser()) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  // getCurrentUser(): Observable<any> {
  //   return this.http
  //     .get(`${this.apiUrl}/auth/current-user`, {
  //       headers: this.getAuthHeaders(),
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error obteniendo usuario actual:', error);
  //         return throwError(error);
  //       })
  //     );
  // }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  refreshToken(): Observable<{ access_token: string }> {
    // Si estás en modo mock
    // if (this.modoMock) {
    //   const token = 'mocked-refreshed-jwt';
    //   localStorage.setItem('token', token);
    //   return of({ access_token: token });
    // }

    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token para refrescar'));
    }

    return this.http
      .post<{ access_token: string }>(
        `${this.apiUrl}/auth/refresh-token`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          if (response.access_token && this.isBrowser()) {
            localStorage.setItem('token', response.access_token);
          }
        }),
        catchError((error) => {
          console.error('Error al refrescar el token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }
}
