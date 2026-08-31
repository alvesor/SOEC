// modules/atributo/repositories/atributo.repository.ts

import { supabase } from '@/core/database/supabase';

// ── Catálogo ──────────────────────────────────────────────────────────────────

export async function obtenerCatalogoPorPadre(id_padre: number) {
    return await supabase.from('catalogo').select('id_catalogo, nombre').eq('id_padre', id_padre).eq('es_activo', true).order('nombre');
}

export async function obtenerCatalogosLov() {
    // Trae IDs de catálogos que aparecen como id_padre de algún hijo
    const { data: hijos, error: errorHijos } = await supabase.from('catalogo').select('id_padre').eq('es_activo', true).neq('id_padre', -1);

    if (errorHijos) throw errorHijos;

    // IDs únicos que son padres
    const idsPadres = Array.from(new Set((hijos ?? []).map((h: any) => h.id_padre)));

    if (idsPadres.length === 0) return { data: [], error: null };

    // Traer solo los catálogos no-sistema que están en esa lista
    return await supabase.from('catalogo').select('id_catalogo, nombre').eq('es_sistema', false).eq('es_activo', true).in('id_catalogo', idsPadres).order('nombre');
}

export async function crearCatalogoConHijos(nombre: string, opciones: string[]) {
    // 1. Crear nodo padre
    const { data: padre, error: errorPadre } = await supabase.from('catalogo').insert({ id_padre: -1, nombre, es_sistema: false, es_activo: true }).select('id_catalogo').single();

    if (errorPadre) throw errorPadre;

    // 2. Crear hijos
    const hijos = opciones
        .filter((o) => o.trim())
        .map((o) => ({
            id_padre: padre.id_catalogo,
            nombre: o.trim(),
            es_sistema: false,
            es_activo: true
        }));

    if (hijos.length > 0) {
        const { error: errorHijos } = await supabase.from('catalogo').insert(hijos);
        if (errorHijos) throw errorHijos;
    }

    return padre;
}

// ── Atributos globales ────────────────────────────────────────────────────────

export async function obtenerAtributos() {
    return await supabase
        .from('atributo')
        .select(
            `
            id_atributo,
            nombre,
            id_tipo_dato,
            id_lov,
            id_categoria,
            id_tipo_ciclo,
            requiere_vigencia,
            es_activo,
            tipo_dato:catalogo!atributo_id_tipo_dato_fkey(id_catalogo, nombre),
            categoria:catalogo!atributo_id_categoria_fkey(id_catalogo, nombre),
            tipo_ciclo:catalogo!atributo_id_tipo_ciclo_fkey(id_catalogo, nombre),
            lov:catalogo!atributo_id_lov_fkey(id_catalogo, nombre)
        `
        )
        .eq('es_activo', true)
        .order('nombre');
}

export async function crearAtributo(data: { nombre: string; id_tipo_dato: number; id_lov?: number | null; id_categoria?: number | null; id_tipo_ciclo?: number | null; requiere_vigencia?: boolean }) {
    return await supabase.from('atributo').insert(data).select().single();
}

export async function actualizarAtributo(
    id_atributo: number,
    data: Partial<{
        id_categoria: number;
        id_tipo_ciclo: number;
        id_lov: number;
        requiere_vigencia: boolean;
    }>
) {
    return await supabase.from('atributo').update(data).eq('id_atributo', id_atributo);
}

// ── Atributos por empresa ─────────────────────────────────────────────────────

export async function obtenerAtributosEmpresa(id_empresa: number) {
    return await supabase
        .from('atributo_medico_empresarial')
        .select(
            `
            id_atributo_medico_empresarial,
            id_empresa,
            id_atributo,
            es_requerido,
            es_visible,
            orden,
            es_editable,
            atributo (
                id_atributo,
                nombre,
                id_tipo_dato,
                id_lov,
                id_categoria,
                id_tipo_ciclo,
                requiere_vigencia,
                es_activo,
                tipo_dato:catalogo!atributo_id_tipo_dato_fkey(id_catalogo, nombre),
                categoria:catalogo!atributo_id_categoria_fkey(id_catalogo, nombre),
                tipo_ciclo:catalogo!atributo_id_tipo_ciclo_fkey(id_catalogo, nombre),
                lov:catalogo!atributo_id_lov_fkey(id_catalogo, nombre)
            )
        `
        )
        .eq('id_empresa', id_empresa)
        .order('orden');
}

export async function agregarAtributoEmpresa(data: { id_empresa: number; id_atributo: number; es_requerido: boolean; es_visible: boolean; orden: number; es_editable: boolean }) {
    return await supabase.from('atributo_medico_empresarial').insert(data).select().single();
}

export async function actualizarAtributoEmpresa(
    id_atributo_medico_empresarial: number,
    data: Partial<{
        es_requerido: boolean;
        es_visible: boolean;
        orden: number;
        es_editable: boolean;
    }>
) {
    return await supabase.from('atributo_medico_empresarial').update(data).eq('id_atributo_medico_empresarial', id_atributo_medico_empresarial);
}

export async function eliminarAtributoEmpresa(id_atributo_medico_empresarial: number) {
    return await supabase.from('atributo_medico_empresarial').delete().eq('id_atributo_medico_empresarial', id_atributo_medico_empresarial);
}
