import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router) {}

  onSubmit(): void {
    this.error = null;

    // Validación simulada
    if (!this.usernameOrEmail || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    // Ejemplo simulado, reemplazalo con llamada HTTP al backend más adelante
    if (
      (this.usernameOrEmail === 'admin' ||
        this.usernameOrEmail === 'admin@correo.com') &&
      this.password === 'Admin123'
    ) {
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/posts']); // Redirige a publicaciones o home
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }
}
