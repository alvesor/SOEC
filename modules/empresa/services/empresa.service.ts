import { obtenerEmpresaPorId, actualizarEmpresa } from '../repositories/empresa.repository';

export async function cargarEmpresa(id_empresa: number) {
    const { data, error } = await obtenerEmpresaPorId(id_empresa);
    if (error) throw error;
    return data;
}

export async function guardarEmpresa(id_empresa: number, data: any) {
    return await actualizarEmpresa(id_empresa, data);
}
