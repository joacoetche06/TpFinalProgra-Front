import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (environment.production && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('ngsw-worker.js');
    }
  })
  .catch(err => console.error(err));
