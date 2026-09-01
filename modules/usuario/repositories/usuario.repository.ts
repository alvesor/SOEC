import { supabase } from '@/core/database/supabase';

// ── Búsqueda de usuarios existentes ──────────────────────────────────────────

export async function buscarUsuariosActivos(texto: string) {
    return await supabase
        .from('persona')
        .select(
            `
            id_persona,
            identificacion,
            nombres,
            apellidos,
            es_activo,
            usuario!inner (
                id_usuario,
                es_activo
            )
        `
        )
        .eq('es_activo', true)
        .eq('usuario.es_activo', true)
        .or(`identificacion.ilike.%${texto}%,nombres.ilike.%${texto}%,apellidos.ilike.%${texto}%`)
        .limit(10);
}

// ── Catálogo tipo de identificación ──────────────────────────────────────────

export async function obtenerRaizCatalogoPorNombre(nombre: string) {
    return await supabase.from('catalogo').select('id_catalogo, nombre').eq('id_padre', -1).ilike('nombre', nombre).eq('es_activo', true).maybeSingle();
}

export async function obtenerCatalogoPorPadre(id_padre: number) {
    return await supabase.from('catalogo').select('id_catalogo, nombre').eq('id_padre', id_padre).eq('es_activo', true).order('nombre');
}

// ── Crear persona + usuario ───────────────────────────────────────────────────

export async function crearPersona(data: { id_tipo_identificacion: number; identificacion: string; nombres: string; apellidos: string }) {
    return await supabase
        .from('persona')
        .insert({ ...data, es_activo: true })
        .select('id_persona')
        .single();
}

export async function crearUsuario(data: { id_persona: number; clave: string }) {
    return await supabase
        .from('usuario')
        .insert({ ...data, es_activo: true })
        .select('id_usuario')
        .single();
}

export async function obtenerResponsablesPorEmpresa(id_empresa: number, roles: number[]) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_rol,
            usuario:id_usuario (
                id_usuario,
                persona:id_persona (
                    id_persona,
                    identificacion,
                    nombres,
                    apellidos
                )
            )
        `
        )
        .eq('id_empresa', id_empresa)
        .in('id_rol', roles);
}
