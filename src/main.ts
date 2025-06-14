import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppComponent } from './app/app.component'; // <-- AppComponent, no QuiensoyComponent
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // <-- tus rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes), // <-- muy importante agregar el router
  ],
});
