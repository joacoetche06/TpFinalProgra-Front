export interface Comentario {
  _id: string;
  texto: string;
  autor: {
    _id: string;
    nombreUsuario: string;
    imagenPerfilUrl?: string;
  };
  postId: string;
  modificado: boolean;
  createdAt: string;
  updatedAt: string;
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
