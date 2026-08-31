export interface Menu {
    id_menu: number;

    id_padre: number;

    nombre: string;

    url?: string;

    icono?: string;

    orden: number;

    es_publico: boolean;

    es_activo: boolean;
}
