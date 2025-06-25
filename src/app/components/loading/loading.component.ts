import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .post('http://localhost:3000/auth/authorize', { token })
      .pipe(delay(1000)) //simula 1 segundo de carga
      .subscribe({
        next: () => {
          this.router.navigate(['/posts']);
          this.sessionService.startSessionTimer();
        },
        error: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
      });
  }
}
