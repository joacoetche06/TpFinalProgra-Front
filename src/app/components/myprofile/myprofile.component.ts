// src/app/pages/my-profile/my-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, Post } from '../../lib/interfaces';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

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
    private postService: PostService
  ) {}

  ngOnInit(): void {
    if (this.modoMock) {
      this.usuario = {
        _id: '123',
        nombre: 'Joaquín',
        email: 'joaco@correo.com',
        foto: '/favicon2.png',
      };

      const todas: Post[] = [
        {
          _id: '1',
          contenido: 'Mi primer post',
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
          contenido: 'Otro más',
          autor: 'Joaquín',
          meGusta: [],
          comentarios: [],
          createdAt: '2025-06-12T09:00:00Z',
        },
        {
          _id: '3',
          contenido: 'Último post',
          autor: 'Joaquín',
          meGusta: [],
          comentarios: [],
          createdAt: '2025-06-11T08:00:00Z',
        },
        {
          _id: '4',
          contenido: 'Este no se ve',
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
      //despues modificar esto para que resiva cantidad
      this.postService.getMisPublicaciones('3').subscribe((posts) => {
        this.publicaciones = posts;
      });
    }
  }
}
