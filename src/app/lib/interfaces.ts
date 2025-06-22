export interface Comentario {
  autor: string; // id o nombre del usuario, según cómo lo uses
  texto: string;
}

export interface Post {
  _id: string;
  descripcion: string;
  autor: Usuario | string;
  meGusta: string[]; // array de ids de usuarios que dieron like
  comentarios: Comentario[];
  createdAt: string; // ISO date string
  updatedAt?: string; // opcional
}

export interface Usuario {
  _id: string;
  nombre: string;
  nombreUsuario: string;
  email: string;
  imagenPerfilUrl?: string; // URL de imagen
}
