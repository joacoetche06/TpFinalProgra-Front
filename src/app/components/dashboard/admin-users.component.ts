import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Usuario } from '../../lib/interfaces';
import { UserService } from '../../services/user/user.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  usuarios: Usuario[] = [];
  form!: FormGroup;
  selectedFile: File | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)],
      ],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: [''],
      descripcion: [''],
    });

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usersService.getUsuarios().subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
      error: () => alert('Error al cargar usuarios'),
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  registrarUsuario(): void {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('apellido', this.form.get('apellido')?.value);
    formData.append('correo', this.form.get('correo')?.value);
    formData.append('nombreUsuario', this.form.get('nombreUsuario')?.value);
    formData.append('password', password);
    formData.append('fechaNacimiento', this.form.get('fechaNacimiento')?.value);
    formData.append('descripcion', this.form.get('descripcion')?.value);
    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    this.usersService.registrarUsuario(formData).subscribe({
      next: (res) => {
        this.snackbarService.showMessage(
          `Usuario ${
            res.data?.nombre || this.form.get('nombre')?.value
          } registrado correctamente!`,
          'success'
        );
        this.form.reset();
        this.selectedFile = null;
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.error = err.error?.message || 'Error desconocido';
      },
    });
  }

  cambiarEstado(usuario: Usuario) {
    this.usersService
      .cambiarEstadoUsuario(usuario._id, !usuario.isActive)
      .subscribe({
        next: () => this.cargarUsuarios(),
        error: () => alert('No se pudo cambiar el estado del usuario'),
      });
  }
}
