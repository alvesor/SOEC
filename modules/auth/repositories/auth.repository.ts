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

            persona (
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

export async function obtenerRolesUsuario(id_usuario: number) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_rol
        `
        )
        .eq('id_usuario', id_usuario);
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

export async function obtenerEmpresasUsuario(id_usuario: number) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_empresa,

            empresa:id_empresa (
                id_empresa,
                razon_social
            )
        `
        )
        .eq('id_usuario', id_usuario);
}
