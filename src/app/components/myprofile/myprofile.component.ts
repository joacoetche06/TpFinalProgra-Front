import { Component } from '@angular/core';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyProfileComponent {
  user = {
    firstName: 'Joaco',
    lastName: 'Etchegaray',
    username: 'joaco123',
    email: 'joaco@mail.com',
    birthDate: '2000-01-01',
    bio: 'Desarrollador y gamer.',
    profileImageUrl: 'assets/images/profile.jpg',
    role: 'usuario',
  };
}
