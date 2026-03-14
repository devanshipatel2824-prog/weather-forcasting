import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from '../firebase-config';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideRouter(routes),
    provideFirestore(() => getFirestore())
  ]
};
