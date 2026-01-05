import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  login() {
    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => alert('Credenciales incorrectas')
    });

  }

  // 👉 IR A REGISTRO
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

