import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSessionComponent } from '../../components/modal/confirm-session/confirm-session.component';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionTimeoutSubscription?: Subscription;
  private countdownSubscription?: Subscription;

  // Observable para que los componentes sepan si la sesión está activa
  sessionActive$ = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  startSessionTimer() {
    // Cancelar cualquier timer activo
    this.clearTimers();

    // Iniciar timer de 1 minuto (60000 ms)
    this.sessionTimeoutSubscription = timer(60000).subscribe(() => {
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
      if (result === true) {
        this.refreshSession();
      } else {
        this.endSession();
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
    this.authService.logout();
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
