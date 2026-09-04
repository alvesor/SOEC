// modules/personal/repositories/personal.repository.ts

import { supabase } from '@/core/database/supabase';

export const ID_ROL_PERSONAL = 4;
export const ID_PADRE_TIPO_IDENTIFICACION = 2;

export async function obtenerTiposIdentificacion() {
    return await supabase.from('catalogo').select('id_catalogo, nombre').eq('id_padre', ID_PADRE_TIPO_IDENTIFICACION).eq('es_activo', true).order('nombre');
}

export async function obtenerPersonalEmpresa(id_empresa: number) {
    return await supabase
        .from('asignacion')
        .select(
            `
            id_usuario,
            usuario:id_usuario (
                id_usuario,
                es_activo,
                persona:id_persona (
                    id_persona,
                    identificacion,
                    nombres,
                    apellidos,
                    es_activo,
                    tipo_identificacion:catalogo!persona_id_tipo_identificacion_fkey(id_catalogo, nombre)
                )
            )
        `
        )
        .eq('id_empresa', id_empresa)
        .eq('id_rol', ID_ROL_PERSONAL);
}

export async function buscarPersonaPorIdentificacion(identificacion: string) {
    return await supabase.from('persona').select('*').eq('identificacion', identificacion).maybeSingle();
}

export async function crearPersona(data: { id_tipo_identificacion: number; identificacion: string; nombres: string; apellidos: string }) {
    return await supabase
        .from('persona')
        .insert({ ...data, es_activo: true })
        .select()
        .single();
}

export async function actualizarPersona(id_persona: number, data: Partial<{ id_tipo_identificacion: number; nombres: string; apellidos: string }>) {
    return await supabase.from('persona').update(data).eq('id_persona', id_persona);
}

export async function actualizarEstadoPersona(id_persona: number, es_activo: boolean) {
    return await supabase.from('persona').update({ es_activo }).eq('id_persona', id_persona);
}

export async function obtenerUsuarioPorPersona(id_persona: number) {
    return await supabase.from('usuario').select('id_usuario, es_activo').eq('id_persona', id_persona).maybeSingle();
}

export async function crearUsuario(data: { id_persona: number; clave: string; es_activo: boolean }) {
    return await supabase.from('usuario').insert(data).select().single();
}

export async function existeAsignacion(id_usuario: number, id_empresa: number, id_rol = ID_ROL_PERSONAL) {
    return await supabase.from('asignacion').select('id_usuario').eq('id_usuario', id_usuario).eq('id_empresa', id_empresa).eq('id_rol', id_rol).maybeSingle();
}

export async function crearAsignacion(id_usuario: number, id_empresa: number, id_rol = ID_ROL_PERSONAL) {
    return await supabase.from('asignacion').insert({ id_usuario, id_empresa, id_rol });
}
