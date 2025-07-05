// src/app/pages/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../lib/interfaces';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';

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

  constructor(private fb: FormBuilder, private usersService: UserService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usersService.getUsuarios().subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
      error: () => alert('Error al cargar usuarios'),
    });
  }

  registrarUsuario() {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) =>
      formData.append(k, String(v ?? ''))
    );

    this.usersService.registrarUsuario(formData).subscribe({
      next: () => {
        this.form.reset();
        this.cargarUsuarios();
      },
      error: () => alert('Error al registrar usuario'),
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
