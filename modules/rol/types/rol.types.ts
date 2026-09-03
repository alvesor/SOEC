// modules/rol/types/rol.types.ts
export interface Rol {
    id_rol: number;
    nombre: string;
    es_activo: boolean;
}

export interface RolForm {
    id_rol?: number;
    nombre: string;
}

export interface MenuTreeNode {
    key: string;
    label: string;
    icon?: string;
    children?: MenuTreeNode[];
    data?: { id_menu: number; url?: string };
}

export interface EstadoCheck {
    checked: boolean;
    partialChecked: boolean;
}

export type SelectedKeysMap = Record<string, EstadoCheck>;
