import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onSubmit(): void {
    this.error = null;

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password,
      birthDate: this.birthDate,
      bio: this.bio,
      profileImage: this.selectedFile, // En el futuro se convierte a FormData
      role: 'usuario', // por defecto
    };

    console.log('Formulario válido. Usuario a registrar:', newUser);

    // Aquí en el futuro vas a usar HttpClient para enviarlo al backend NestJS

    // Redireccionar o mostrar mensaje
    this.router.navigate(['/login']);
  }
}
