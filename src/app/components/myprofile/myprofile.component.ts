// src/app/pages/my-profile/my-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, Post } from '../../lib/interfaces';
import { UserService } from '../../services/user/user.service';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyProfileComponent implements OnInit {
  modoMock = true;
  usuario: Usuario | null = null;
  publicaciones: Post[] = [];

  constructor(
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.modoMock) {
      this.usuario = {
        _id: '123',
        nombre: 'Joaquín',
        nombreUsuario: 'Joacoetche',
        email: 'joaco@correo.com',
        foto: '/favicon2.png',
      };

      const todas: Post[] = [
        {
          _id: '1',
          descripcion: 'Mi primer post',
          autor: 'Joaquín',
          meGusta: ['123'],
          comentarios: [
            { autor: 'Ana', texto: 'Genial!' },
            { autor: 'Pia', texto: 'Que bueno!' },
          ],
          createdAt: '2025-06-13T10:00:00Z',
        },
        {
          _id: '2',
          descripcion: 'Otro más',
          autor: 'Joaquín',
          meGusta: [],
          comentarios: [],
          createdAt: '2025-06-12T09:00:00Z',
        },
        {
          _id: '3',
          descripcion: 'Último post',
          autor: 'Joaquín',
          meGusta: [],
          comentarios: [
            { autor: 'Ana', texto: 'Genial!' },
            { autor: 'Pia', texto: 'Que bueno!' },
          ],
          createdAt: '2025-06-11T08:00:00Z',
        },
        {
          _id: '4',
          descripcion: 'Este no se ve',
          autor: 'Joaquín',
          meGusta: [],
          comentarios: [],
          createdAt: '2025-06-10T07:00:00Z',
        },
      ];

      this.publicaciones = todas
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);
    } else {
      this.userService.getMiPerfil().subscribe((usuario) => {
        this.usuario = usuario;
      });

      const userId = this.authService.getUserId(); // ✅ obtiene el ID desde el token

      if (userId) {
        this.postService.getPostsByUser(userId, 3).subscribe((posts) => {
          this.publicaciones = posts;
        });
      }
    }
  }
}
