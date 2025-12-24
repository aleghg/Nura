import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data)
      .pipe(
        tap(res => localStorage.setItem('token', res.token))
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
