import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './app/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';


bootstrapApplication(App, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot([]),
      HttpClientModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
.catch(err => console.error(err));
