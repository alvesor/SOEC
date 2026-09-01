import type { CrearPersonaUsuarioDTO } from '@/modules/usuario/types/usuario.types';

export interface Empresa {
    id_empresa: number;

    razon_social: string;

    ruc?: string;

    descripcion?: string;

    correo?: string;

    telefono?: string;

    logo?: string;
}

export interface CrearEmpresaDTO {
    razon_social: string;
    ruc: string;
    correo?: string;
    telefono?: string;
}

export interface ResponsableItem {
    key: string; // identificador local para la UI
    esNuevo: boolean;
    id_usuario?: number; // presente si es usuario existente
    nombreCompleto: string;
    identificacion: string;
    roles: number[]; // ids de rol: 2 (Médico) y/o 3 (SSO)
    nuevoUsuario?: CrearPersonaUsuarioDTO; // presente si esNuevo = true
}
