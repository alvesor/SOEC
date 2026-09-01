// modules/atributo/types/atributo.types.ts

export interface Atributo {
    id_atributo: number;
    nombre: string;
    id_tipo_dato: number;
    id_lov?: number;
    id_categoria?: number;
    id_tipo_ciclo?: number;
    requiere_vigencia?: boolean;
    es_activo: boolean;
    // joins desde catalogo
    tipo_dato?: { id_catalogo: number; nombre: string };
    categoria?: { id_catalogo: number; nombre: string };
    tipo_ciclo?: { id_catalogo: number; nombre: string };
}

export interface AtributoMedicoEmpresarial {
    id_atributo_medico_empresarial: number;
    id_empresa: number;
    id_atributo: number;
    es_requerido: boolean;
    es_visible: boolean;
    orden: number;
    es_editable: boolean;
    atributo?: Atributo;
}

// Formulario unificado: cubre tanto atributo global como configuración empresa
export interface AtributoForm {
    // atributo_medico_empresarial
    id_atributo_medico_empresarial?: number;
    es_requerido: boolean;
    es_visible: boolean;
    es_editable: boolean;
    orden: number;
    // atributo global
    id_atributo: number | null;
    esNuevoAtributo: boolean;
    nombre: string;
    id_tipo_dato: number | null;
    id_lov?: number | null;
    id_categoria: number | null;
    id_tipo_ciclo: number | null;
    requiere_vigencia: boolean;
}

export interface CatalogoItem {
    id_catalogo: number;
    nombre: string;
}
