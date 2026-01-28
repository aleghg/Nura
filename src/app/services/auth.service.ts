import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginRequest, LoginResponse } from '../models/login.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = `${environment.apiUrl}/auth`;

  private usuarioSubject = new BehaviorSubject<{ email: string; rol: string } | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const email = localStorage.getItem('email');
    const rol = localStorage.getItem('rol');
    if (email && rol) {
      this.usuarioSubject.next({ email, rol });
    }
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        localStorage.setItem('rol', res.rol);
        this.usuarioSubject.next({ email: res.email, rol: res.rol });
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.usuarioSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }
}
