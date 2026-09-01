import { supabase } from '@/core/database/supabase';

export async function obtenerMenusActivos() {
    return await supabase.from('menu').select('*').eq('es_activo', true).order('orden', {
        ascending: true
    });
}
