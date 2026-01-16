import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginRequest, LoginResponse } from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  // 🔐 LOGIN
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', res.email);
          localStorage.setItem('rol', res.rol);
        })
      );
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.clear();
  }

  // 🔎 AUTENTICACIÓN
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }



  // 📝 REGISTRO
  register(data: {
    nombre: string;
    email: string;
    password: string;
    rol?: string;
  }): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.API}/register`,
      data
    );
  }
}