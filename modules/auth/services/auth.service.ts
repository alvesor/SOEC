import bcrypt from 'bcryptjs';

import { obtenerUsuarioPorIdentificacion, obtenerRolesActivosPorEmpresa, obtenerPermisosRoles, obtenerEmpresasConRolActivo } from '@/modules/auth/repositories/auth.repository';

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
     * Empresas donde el usuario tiene al menos un rol activo.
     * Si viene vacío, cubre en un solo chequeo:
     * - usuario sin ninguna empresa asignada
     * - usuario con empresas pero con todos sus roles
     *   inactivos en todas ellas
     * En ambos casos se niega el acceso.
     */

    const empresas = await obtenerEmpresasDeduplicadas(data.id_usuario);

    if (empresas.length === 0) {
        return null;
    }

    /*
     * Empresa activa + permisos al iniciar sesión:
     * - 1 sola empresa -> se autoselecciona y se calculan sus permisos
     * - 2+ empresas     -> queda sin seleccionar; el usuario elige en
     *                       /dashboard/seleccionar-empresa
     */

    let empresa_activa = null;
    let permisos: string[] = [];

    if (empresas.length === 1) {
        empresa_activa = empresas[0];
        permisos = await calcularPermisos(data.id_usuario, empresa_activa.id_empresa);
    }

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

/*
 * Urls de menú a las que tiene acceso un usuario dentro
 * de una empresa, considerando únicamente roles activos
 * (rol.es_activo = true) y unión de permisos si tiene
 * varios roles en esa empresa.
 */
export async function calcularPermisos(id_usuario: number, id_empresa: number) {
    const { data: asignaciones } = await obtenerRolesActivosPorEmpresa(id_usuario, id_empresa);

    const roles = asignaciones?.map((a: any) => a.id_rol) || [];

    if (roles.length === 0) {
        return [];
    }

    const { data: permisosData } = await obtenerPermisosRoles(roles);

    const permisos: string[] = [];

    permisosData?.forEach((permiso: any) => {
        const url = permiso.menu?.url;

        if (url && url !== '/dashboard' && !permisos.includes(url)) {
            permisos.push(url);
        }
    });

    return permisos;
}

/*
 * Cambia la empresa activa del usuario, validando que
 * realmente tenga un rol activo en ella (nunca confiar en
 * lo que manda el cliente), y recalcula sus permisos
 * server-side.
 */
export async function cambiarEmpresaActiva(id_usuario: number, id_empresa: number) {
    const empresas = await obtenerEmpresasDeduplicadas(id_usuario);

    const empresa_activa = empresas.find((e) => e.id_empresa === id_empresa);

    if (!empresa_activa) {
        /*
         * El usuario no tiene rol activo en esta empresa
         * -> se ignora el cambio
         */
        return null;
    }

    const permisos = await calcularPermisos(id_usuario, id_empresa);

    return { empresa_activa, permisos };
}

async function obtenerEmpresasDeduplicadas(id_usuario: number) {
    const { data: empresasData, error } = await obtenerEmpresasConRolActivo(id_usuario);

    if (error) {
        console.error('[auth] obtenerEmpresasConRolActivo:', error);
    }

    const empresasMap = new Map<number, any>();

    empresasData?.forEach((item: any) => {
        const empresa = Array.isArray(item.empresa) ? item.empresa[0] : item.empresa;

        if (empresa) {
            empresasMap.set(empresa.id_empresa, empresa);
        }
    });

    return Array.from(empresasMap.values());
}
