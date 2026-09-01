import { supabase } from '@/core/database/supabase';

export async function obtenerEmpresaPorId(id_empresa: number) {
    return await supabase.from('empresa').select('*').eq('id_empresa', id_empresa).single();
}

export async function actualizarEmpresa(id_empresa: number, data: any) {
    return await supabase.from('empresa').update(data).eq('id_empresa', id_empresa);
}
