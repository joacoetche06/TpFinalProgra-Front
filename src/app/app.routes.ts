import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';

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
    path: 'posts/:id',
    loadComponent: () =>
      import('./components/post-content/post-content.component').then(
        (m) => m.PostContentComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('./components/loading/loading.component').then(
        (m) => m.LoadingComponent
      ),
  },
  {
    path: 'dashboard/usuarios',
    loadComponent: () =>
      import('./components/dashboard/admin-users.component').then(
        (m) => m.AdminUsersComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'dashboard/estadisticas',
    loadComponent: () =>
      import('./components/dashboard/admin-stats.component').then(
        (m) => m.AdminStatsComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
