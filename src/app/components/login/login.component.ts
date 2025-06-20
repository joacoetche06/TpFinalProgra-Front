import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.error = null;

    if (!this.usernameOrEmail || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService
      .login(this.usernameOrEmail, this.password)
      .then(() => this.router.navigate(['/posts']))
      .catch((err) => {
        console.log(err);
        this.error = typeof err === 'string' ? err : 'Error al iniciar sesión';
      });
  }
}
