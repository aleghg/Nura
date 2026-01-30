import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // 🔹 No interceptar login / register
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }
    
    const token = this.auth.getToken();

    if (!token) {
      console.warn('⚠️ Request sin token:', req.url);
      return next.handle(req);
    }

    // ⚠️ setHeaders reemplaza — NO concatena
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('🔐 Token agregado a:', req.url);

    return next.handle(authReq);
  }
}