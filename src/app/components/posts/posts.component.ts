import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts',
  imports: [FormsModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  posts: any[] = []; // o del tipo que uses

  // posts = [
  // {
  //   username: 'joaco123',
  //   userImage: 'assets/images/profile.jpg',
  //   content: '¡Hola mundo! Esta es mi primera publicación.',
  //   date: new Date(),
  // },
  // {
  //   username: 'ana_dev',
  //   userImage: 'assets/images/user2.jpg',
  //   content: 'Angular es lo más 🔥',
  //   date: new Date(),
  // },
  // ];
}
