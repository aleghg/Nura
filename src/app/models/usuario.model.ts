export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USUARIO';
  fechaRegistro: string; // viene como ISO string desde el backend
  cedula?: string;
  telefono?: string;
}
