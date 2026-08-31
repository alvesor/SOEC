import { supabase } from '@/core/database/supabase';

import { UploadDocumentoDTO } from '../types/documento.types';

export async function subirDocumento(dto: UploadDocumentoDTO) {
    return await supabase.storage

        .from(dto.bucket)

        .upload(dto.path, dto.file, {
            upsert: true
        });
}

export function obtenerUrlPublica(bucket: string, path: string) {
    return supabase.storage

        .from(bucket)

        .getPublicUrl(path);
}
