// modules/atributo/services/atributo.service.ts

import {
    obtenerCatalogoPorPadre,
    obtenerCatalogosLov,
    crearCatalogoConHijos,
    obtenerAtributos,
    crearAtributo,
    actualizarAtributo,
    obtenerAtributosEmpresa,
    agregarAtributoEmpresa,
    actualizarAtributoEmpresa,
    eliminarAtributoEmpresa
} from '../repositories/atributo.repository';

// ── IDs de nodos padre en catalogo ───────────────────────────────────────────
// Ajusta con los IDs reales de tu BD tras correr el DDL
export const CATALOGO_PADRE = {
    TIPO_DATO: 3,
    CATEGORIA_ATRIBUTO: 14,
    TIPO_CICLO: 9
};

export const ID_TIPO_LOV = 19;

// ── Catálogos ─────────────────────────────────────────────────────────────────

export async function cargarTiposDato() {
    const { data, error } = await obtenerCatalogoPorPadre(CATALOGO_PADRE.TIPO_DATO);
    if (error) throw error;
    return data ?? [];
}

export async function cargarCategoriasAtributo() {
    const { data, error } = await obtenerCatalogoPorPadre(CATALOGO_PADRE.CATEGORIA_ATRIBUTO);
    if (error) throw error;
    return data ?? [];
}

export async function cargarTiposCiclo() {
    const { data, error } = await obtenerCatalogoPorPadre(CATALOGO_PADRE.TIPO_CICLO);
    if (error) throw error;
    return data ?? [];
}

export async function cargarCatalogosLov() {
    const { data, error } = await obtenerCatalogosLov();
    if (error) throw error;
    return data ?? [];
}

export async function crearListaLov(nombre: string, opciones: string[]) {
    return await crearCatalogoConHijos(nombre, opciones);
}

// ── Atributos globales ────────────────────────────────────────────────────────

export async function cargarAtributos() {
    const { data, error } = await obtenerAtributos();
    if (error) throw error;
    return data ?? [];
}

export async function crearNuevoAtributo(data: { nombre: string; id_tipo_dato: number; id_lov?: number | null; id_categoria?: number | null; id_tipo_ciclo?: number | null; requiere_vigencia?: boolean }) {
    const { data: result, error } = await crearAtributo(data);
    if (error) throw error;
    return result;
}

export async function actualizarAtributoGlobal(
    id_atributo: number,
    data: Partial<{
        id_categoria: number;
        id_tipo_ciclo: number;
        id_lov: number;
        requiere_vigencia: boolean;
    }>
) {
    const { error } = await actualizarAtributo(id_atributo, data);
    if (error) throw error;
}

// ── Atributos por empresa ─────────────────────────────────────────────────────

export async function cargarAtributosEmpresa(id_empresa: number) {
    const { data, error } = await obtenerAtributosEmpresa(id_empresa);
    if (error) throw error;
    return data ?? [];
}

export async function agregarAtributoAEmpresa(payload: { id_empresa: number; id_atributo: number; es_requerido: boolean; es_visible: boolean; orden: number; es_editable: boolean }) {
    const { data, error } = await agregarAtributoEmpresa(payload);
    if (error) throw error;
    return data;
}

export async function actualizarAtributoDeEmpresa(
    id_atributo_medico_empresarial: number,
    data: Partial<{
        es_requerido: boolean;
        es_visible: boolean;
        orden: number;
        es_editable: boolean;
    }>
) {
    const { error } = await actualizarAtributoEmpresa(id_atributo_medico_empresarial, data);
    if (error) throw error;
}

export async function eliminarAtributoDeEmpresa(id_atributo_medico_empresarial: number) {
    const { error } = await eliminarAtributoEmpresa(id_atributo_medico_empresarial);
    if (error) throw error;
}
