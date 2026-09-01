import { supabase } from '@/core/database/supabase';

export async function crearAsignaciones(filas: { id_usuario: number; id_rol: number; id_empresa: number }[]) {
    console.log('ejecutado crearAsignaciones');
    return await supabase.from('asignacion').insert(filas);
}

export async function eliminarAsignacionesPorEmpresaYRoles(id_empresa: number, roles: number[]) {
    return await supabase.from('asignacion').delete().eq('id_empresa', id_empresa).in('id_rol', roles);
}
