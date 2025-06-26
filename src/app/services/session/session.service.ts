import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSessionComponent } from '../../components/modal/confirm-session/confirm-session.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionTimeoutSubscription?: Subscription;
  private countdownSubscription?: Subscription;

  // Observable para que los componentes sepan si la sesión está activa
  sessionActive$ = new BehaviorSubject<boolean>(true);

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  startSessionTimer() {
    // Cancelar cualquier timer activo
    this.clearTimers();

    // Iniciar timer de 10 minutos (600000 ms)
    this.sessionTimeoutSubscription = timer(600000).subscribe(() => {
      this.promptSessionExtension();
    });
  }

  private promptSessionExtension() {
    // Abrir diálogo para preguntar si quiere extender la sesión
    const dialogRef = this.dialog.open(ConfirmSessionComponent, {
      width: '350px',
      disableClose: true,
      data: { message: 'Quedan 5 minutos de sesión. ¿Deseas extenderla?' },
    });

    // Esperar respuesta del usuario
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
      if (result === true) {
        this.refreshSession();
      } else {
        this.countdownSubscription = timer(300000).subscribe(() => {
          this.endSession();
        });
      }
    });
  }

  private refreshSession() {
    this.authService.refreshToken().subscribe({
      next: (res) => {
        // Reiniciar el timer con nuevo token
        this.startSessionTimer();
      },
      error: () => {
        this.endSession();
      },
    });
  }

  endSession() {
    this.sessionActive$.next(false);
    this.dialog
      .open(ConfirmSessionComponent, {
        width: '350px',
        disableClose: true,
        data: {
          message:
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          expired: true, // podés usar esto para cambiar botones del modal
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.authService.logout(); // ahora sí, limpiar token
        this.router.navigate(['/login']);
      });
    // Podés agregar navegación al login aquí si querés
  }

  private clearTimers() {
    this.sessionTimeoutSubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
  }

  stopSessionTimer() {
    this.clearTimers();
    this.sessionActive$.next(false);
  }
}
