import { subirDocumento, obtenerUrlPublica } from '../repositories/documento.repository';
import imageCompression from 'browser-image-compression';
const EXTENSIONES_PERMITIDAS = ['png', 'jpg', 'jpeg', 'webp'];

const MAX_SIZE = 2 * 1024 * 1024;

export async function subirImagenEmpresa(
    id_empresa: number,

    file: File
) {
    /*
     * Validar archivo
     */

    if (!file) {
        throw new Error('Archivo requerido');
    }

    /*
     * Tamaño
     */

    if (file.size > MAX_SIZE) {
        throw new Error('Archivo excede tamaño permitido');
    }

    const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,

        maxWidthOrHeight: 1200,

        useWebWorker: true,

        fileType: 'image/webp'
    });

    const extension = 'webp';

    const webpFile = new File([compressedFile], 'logo.webp', {
        type: 'image/webp'
    });

    const path = `empresa/` + `${id_empresa}/` + `logo.${extension}`;

    /*
     * Bucket
     */

    const bucket = 'empresa';

    /*
     * Upload
     */

    const { error } = await subirDocumento({
        bucket,

        path,

        file: webpFile
    });

    if (error) {
        throw error;
    }

    /*
     * URL pública
     */

    const { data } = obtenerUrlPublica(bucket, path);

    return data.publicUrl;
}
