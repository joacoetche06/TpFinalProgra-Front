import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./components/posts/posts.component').then(
        (m) => m.PostsComponent
      ),
    canActivate: [AuthGuard],

    pathMatch: 'full',
  },
  {
    path: 'myprofile',
    loadComponent: () =>
      import('./components/myprofile/myprofile.component').then(
        (m) => m.MyProfileComponent
      ),
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
