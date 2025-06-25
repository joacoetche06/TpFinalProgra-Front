import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.sessionService.endSession();
            this.handleUnauthorized();
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }
  private handleUnauthorized() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
