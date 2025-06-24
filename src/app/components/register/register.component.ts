import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  birthDate = '';
  bio = '';
  selectedFile: File | null = null;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onSubmit(): void {
    this.error = null;

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.firstName);
    formData.append('apellido', this.lastName);
    formData.append('correo', this.email);
    formData.append('nombreUsuario', this.username);
    formData.append('password', this.password);
    formData.append('fechaNacimiento', this.birthDate);
    formData.append('descripcion', this.bio);
    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.snackbarService.showMessage(
          `Gracias por registrarte ${res.data.nombre}!`,
          'success'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.error = err.error?.message || 'Error desconocido';
      },
    });
  }
}
