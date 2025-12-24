import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login({ email: this.email, password: this.password })
      .subscribe(() => this.router.navigate(['/']));
  }
}
