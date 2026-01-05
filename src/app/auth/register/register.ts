import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // aquí luego conectas backend
    console.log('Register:', this.name, this.email);

    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
