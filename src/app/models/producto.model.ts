export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: number;
  stock: number;
  imagen: string; // 👈 BASE64
  idCategoria: number;
}
