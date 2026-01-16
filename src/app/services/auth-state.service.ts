import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  private emailSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('email')
  );
  email$ = this.emailSubject.asObservable();

  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getEmail(): string | null {
    return this.emailSubject.value;
  }

  setEmail(email: string): void {
    localStorage.setItem('email', email);
    this.emailSubject.next(email);
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  login(email: string, token: string, rol: string): void {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    this.emailSubject.next(email); // 🔹 reactivo
  }

  logout(): void {
    localStorage.clear();
    this.emailSubject.next(null); // 🔹 reactivo
    this.router.navigate(['/login']);
  }
}
