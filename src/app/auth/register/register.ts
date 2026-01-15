import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {FormGroup,ReactiveFormsModule,Validators,NonNullableFormBuilder} from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  // 👁️ VISIBILIDAD CONTRASEÑAS
  showPassword = false;
  showConfirmPassword = false;

  // 🔴 ERRORES BACKEND
  errores: { [key: string]: string } = {};
  mensajeGeneral: string = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
        ]
      ],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });

    // 🧹 Limpiar errores al escribir
    this.form.valueChanges.subscribe(() => {
      this.errores = {};
      this.mensajeGeneral = '';
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {

    this.errores = {};
    this.mensajeGeneral = '';

    // 1️⃣ Validación frontend
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.get('password')!.value.trim();
    const confirmPassword = this.form.get('confirmPassword')!.value.trim();

    // 2️⃣ Validación local de contraseñas
    if (password !== confirmPassword) {
      this.errores['confirmPassword'] = 'Las contraseñas no coinciden';
      return;
    }

    // 3️⃣ Objeto para backend
    const data = {
      nombre: this.form.get('nombre')!.value.trim(),
      email: this.form.get('email')!.value.trim().toLowerCase(),
      password,
      rol: 'CLIENTE'
    };

    // 4️⃣ Llamada backend
    this.auth.register(data).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Cuenta creada 🎉',
          text: res.mensaje,
          icon: 'success',
          confirmButtonColor: '#C6A97E'
        });

        this.router.navigate(['/login']);
      },

      error: (err: any) => {
        console.error('ERROR REAL:', err);

        // 🔴 Validaciones backend por campo
        if (err.error?.codigo === 'VALIDACION') {
          this.errores = err.error.errores;
          return;
        }

        // 🔴 Error general
        this.mensajeGeneral =
          typeof err.error?.mensaje === 'string'
            ? err.error.mensaje
            : 'Error al registrar';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
