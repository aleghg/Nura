export interface ActualizarPerfilDTO {
  nombre: string;
  email: string;
  currentPassword?: string; // opcional
  newPassword?: string;     // opcional
}
