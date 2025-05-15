import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "vizilabda-bajnoksag", appId: "1:306338730411:web:846c0e145e4c1d1451c2ee", storageBucket: "vizilabda-bajnoksag.firebasestorage.app", apiKey: "AIzaSyD5qMbs99ba1dTW2OynYcLx20Yg4JyggcI", authDomain: "vizilabda-bajnoksag.firebaseapp.com", messagingSenderId: "306338730411" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
