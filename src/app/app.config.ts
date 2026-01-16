import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors,withInterceptorsFromDi,HTTP_INTERCEPTORS } from '@angular/common/http';
import { tokenInterceptor } from './auth/token-interceptor';
import { routes } from './app.routes';
import { ErrorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // 🔹 HttpClient con interceptores
    provideHttpClient(
      withInterceptors([tokenInterceptor]),   // interceptor funcional
      withInterceptorsFromDi()                 // interceptores por DI (clases)
    ),

    // 🔴 ErrorInterceptor global
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};
