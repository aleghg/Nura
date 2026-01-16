import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated() || auth.getRol() !== 'ADMIN') {
    console.log('Ruta admin protegida: acceso denegado');
    router.navigate(['/shop']); // Redirige si no es ADMIN
    return false;
  }

  return true;
};
