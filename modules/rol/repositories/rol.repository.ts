// modules/rol/repositories/rol.repository.ts
import { supabase } from '@/core/database/supabase';

export async function obtenerRoles() {
    return await supabase.from('rol').select('*').order('es_activo', { ascending: false }).order('nombre', { ascending: true });
}

export async function crearRol(nombre: string) {
    return await supabase.from('rol').insert({ nombre, es_activo: true }).select().single();
}

export async function actualizarRol(id_rol: number, data: Partial<{ nombre: string; es_activo: boolean }>) {
    return await supabase.from('rol').update(data).eq('id_rol', id_rol);
}

export async function obtenerMenusParaArbol() {
    return await supabase.from('menu').select('*').eq('es_activo', true).order('orden');
}

export async function obtenerPermisosDeRol(id_rol: number) {
    return await supabase.from('permiso').select('id_menu').eq('id_rol', id_rol);
}

export async function reemplazarPermisosDeRol(id_rol: number, ids_menu: number[]) {
    const { error: errorDelete } = await supabase.from('permiso').delete().eq('id_rol', id_rol);

    if (errorDelete) return { error: errorDelete };

    if (ids_menu.length === 0) return { error: null };

    const registros = ids_menu.map((id_menu) => ({ id_rol, id_menu }));

    return await supabase.from('permiso').insert(registros);
}
