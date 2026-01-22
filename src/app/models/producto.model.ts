export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;

  // 👇 backend real
  idCategoria?: number;
  imagenBase64?: string;

  // 👇 legacy (no se eliminan)
  activo?: boolean;
  categoria?: any;
}
