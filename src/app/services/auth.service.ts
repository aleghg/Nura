import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginRequest, LoginResponse } from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = `${environment.apiUrl}/auth`;

  // Observable del usuario logueado
  private usuarioSubject = new BehaviorSubject<{ email: string; rol: string } | null>(null);
  usuario$ = this.usuarioSubject.asObservable();


  constructor(private http: HttpClient) {
    // Inicializar desde localStorage si ya hay datos
    const email = localStorage.getItem('email');
    const rol = localStorage.getItem('rol');
    if (email && rol) {
      this.usuarioSubject.next({ email, rol });
    }
  }

  // 🔐 LOGIN
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', res.email);
          localStorage.setItem('rol', res.rol);

        // Actualizar observable del usuario
        this.usuarioSubject.next({ email: res.email, rol: res.rol });
      })
    );
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.clear();
    this.usuarioSubject.next(null); // Limpiar observable
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

  // 🔹 MÉTODO PARA OBTENER EL EMAIL
  getEmail(): string | null {
    return localStorage.getItem('email');
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
