import bcrypt from 'bcryptjs';

import { obtenerUsuarioPorIdentificacion, obtenerRolesUsuario, obtenerPermisosRoles, obtenerEmpresasUsuario } from '@/modules/auth/repositories/auth.repository';

export async function loginUsuario(identificacion: string, password: string) {
    const { data, error } = await obtenerUsuarioPorIdentificacion(identificacion);

    if (error || !data) {
        return null;
    }

    const passwordCorrecta = await bcrypt.compare(password, data.clave);

    if (!passwordCorrecta) {
        return null;
    }

    if (!data.es_activo) {
        return null;
    }

    const persona = Array.isArray(data.persona) ? data.persona[0] : data.persona;

    if (!persona?.es_activo) {
        return null;
    }

    /*
     * Roles
     */

    const { data: asignaciones } = await obtenerRolesUsuario(data.id_usuario);

    const roles = asignaciones?.map((a: any) => a.id_rol) || [];

    /*
     * Permisos
     */

    const { data: permisosData } = await obtenerPermisosRoles(roles);

    const permisos: string[] = [];

    permisosData?.forEach((permiso: any) => {
        const url = permiso.menu?.url;

        if (url && url !== '/dashboard' && !permisos.includes(url)) {
            permisos.push(url);
        }
    });

    /*
     * Empresas
     */

    const { data: empresasData } = await obtenerEmpresasUsuario(data.id_usuario);

    const empresas = empresasData?.map((item: any) => item.empresa) || [];

    const empresa_activa = empresas.length === 1 ? empresas[0] : null;

    return {
        id: data.id_usuario.toString(),

        id_usuario: data.id_usuario,

        name: `${persona.nombres} ${persona.apellidos}`,

        identificacion: persona.identificacion,

        permisos,

        empresas,

        empresa_activa
    };
}
