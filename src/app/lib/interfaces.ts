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
  titulo?: string;
  descripcion: string;
  imagenUrl?: string;
  autor: string | Usuario;
  meGusta: string[];
  comentarios?: Comentario[];
  comentariosCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Usuario {
  _id: string;
  nombre: string;
  nombreUsuario: string;
  correo: string;
  descripcion?: string;
  fechaNacimiento?: Date | string; // Fecha de nacimiento
  perfil: string; // URL del perfil
  imagenPerfilUrl?: string; // URL de imagen
  isActive?: boolean; // Indica si el usuario está activo
}
