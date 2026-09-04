// modules/personal/types/personal.types.ts

export interface CatalogoItem {
    id_catalogo: number;
    nombre: string;
}

export interface PersonalListadoItem {
    id_persona: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
    es_activo: boolean;
    tipo_identificacion?: CatalogoItem;
    id_usuario?: number | null;
    usuario_activo?: boolean;
}

export interface PersonalForm {
    id_persona?: number;
    id_tipo_identificacion: number | null;
    identificacion: string;
    nombres: string;
    apellidos: string;
    requiere_acceso: boolean;
}

export interface FilaCargaMasiva {
    fila: number;
    tipo_identificacion: string;
    identificacion: string;
    nombres: string;
    apellidos: string;
}

export interface ResultadoCargaMasiva {
    exitos: number;
    errores: { fila: number; motivo: string }[];
}
