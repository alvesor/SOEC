import { supabase } from '@/core/database/supabase';

export async function obtenerUsuarioPorIdentificacion(identificacion: string) {
    return await supabase
        .from('usuario')
        .select(
            `
            id_usuario,
            clave,
            es_activo,
            id_persona,

            persona!inner (
                id_persona,
                identificacion,
                nombres,
                apellidos,
                es_activo
            )
        `
        )
        .eq('persona.identificacion', identificacion)
        .single();
}

/*
 * Roles activos de un usuario dentro de una empresa específica.
 * - Filtra por id_empresa (permisos no son globales, son por asignación)
 * - Usa rol!inner para que es_activo=true filtre la tabla base (patrón ya usado en persona!inner)
 */
export async function obtenerRolesActivosPorEmpresa(id_usuario: number, id_empresa: number) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_rol,

            rol!inner (
                es_activo
            )
        `
        )
        .eq('id_usuario', id_usuario)
        .eq('id_empresa', id_empresa)
        .eq('rol.es_activo', true);
}

export async function obtenerPermisosRoles(roles: number[]) {
    return await supabase
        .from('permiso')
        .select(
            `
            menu:id_menu (
                url
            )
        `
        )
        .in('id_rol', roles);
}

/*
 * Empresas donde el usuario tiene AL MENOS UN rol activo.
 * Esta es la única fuente de verdad de "a qué empresas
 * puede acceder el usuario": si aquí no aparece una empresa,
 * es porque no tiene asignación o todos sus roles en ella
 * están inactivos.
 */
export async function obtenerEmpresasConRolActivo(id_usuario: number) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_empresa,

            empresa:id_empresa (
                id_empresa,
                razon_social
            ),

            rol!inner (
                es_activo
            )
        `
        )
        .eq('id_usuario', id_usuario)
        .eq('rol.es_activo', true);
}
