import { supabase } from '@/core/database/supabase';

export async function obtenerEmpresaPorId(id_empresa: number) {
    return await supabase.from('empresa').select('*').eq('id_empresa', id_empresa).single();
}

export async function actualizarEmpresa(id_empresa: number, data: any) {
    return await supabase.from('empresa').update(data).eq('id_empresa', id_empresa);
}

export async function crearEmpresa(data: { razon_social: string; ruc: string; correo?: string; telefono?: string }) {
    return await supabase
        .from('empresa')
        .insert({ ...data, es_activo: true })
        .select('id_empresa')
        .single();
}

export async function obtenerEmpresas() {
    return await supabase.from('empresa').select('*').order('razon_social');
}
