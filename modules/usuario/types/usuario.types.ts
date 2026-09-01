export interface UsuarioBusqueda {
    id_usuario: number;
    id_persona: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
}

export interface CrearPersonaUsuarioDTO {
    id_tipo_identificacion: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
    clave: string;
}

export interface TipoIdentificacion {
    id_catalogo: number;
    nombre: string;
}
