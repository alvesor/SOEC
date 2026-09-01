import { obtenerEmpresaPorId, actualizarEmpresa } from '../repositories/empresa.repository';
import { crearEmpresa as crearEmpresaRepo, obtenerEmpresas } from '../repositories/empresa.repository';
import { crearAsignaciones } from '@/modules/asignacion/repositories/asignacion.repository';
import { crearPersonaYUsuario } from '@/modules/usuario/services/usuario.service';
import type { CrearEmpresaDTO, ResponsableItem } from '../types/empresa.types';
import { cargarResponsablesEmpresa } from '@/modules/usuario/services/usuario.service';
import { eliminarAsignacionesPorEmpresaYRoles } from '@/modules/asignacion/repositories/asignacion.repository';
import { actualizarEmpresa as actualizarEmpresaRepo } from '../repositories/empresa.repository';
import { ROLES } from '../constants';

export async function cargarEmpresa(id_empresa: number) {
    const { data, error } = await obtenerEmpresaPorId(id_empresa);
    if (error) throw error;
    return data;
}

export async function guardarEmpresa(id_empresa: number, data: any) {
    return await actualizarEmpresa(id_empresa, data);
}

export async function listarEmpresas() {
    const { data, error } = await obtenerEmpresas();
    if (error) throw error;
    return data ?? [];
}

export async function crearEmpresaConResponsables(datosEmpresa: CrearEmpresaDTO, responsables: ResponsableItem[]) {
    // 1. Crear empresa
    const { data: empresa, error: errorEmpresa } = await crearEmpresaRepo(datosEmpresa);
    if (errorEmpresa) throw errorEmpresa;

    const id_empresa = empresa.id_empresa;

    // 2. Resolver/crear usuario de cada responsable
    const filasAsignacion: { id_usuario: number; id_rol: number; id_empresa: number }[] = [];

    for (const resp of responsables) {
        let id_usuario = resp.id_usuario;

        if (resp.esNuevo && resp.nuevoUsuario) {
            id_usuario = await crearPersonaYUsuario(resp.nuevoUsuario);
        }

        if (!id_usuario) continue;

        for (const id_rol of resp.roles) {
            filasAsignacion.push({ id_usuario, id_rol, id_empresa });
        }
    }

    // 3. Registrar asignaciones (empresa + rol por cada responsable/rol)
    if (filasAsignacion.length > 0) {
        const { error: errorAsignacion } = await crearAsignaciones(filasAsignacion);
        console.log(errorAsignacion);

        if (errorAsignacion) throw errorAsignacion;
    }

    return empresa;
}

export async function cargarEmpresaConResponsables(id_empresa: number) {
    const empresa = await cargarEmpresa(id_empresa); // ya existe en este archivo
    const responsables = await cargarResponsablesEmpresa(id_empresa);
    return { empresa, responsables };
}

export async function actualizarEmpresaConResponsables(id_empresa: number, datosEmpresa: CrearEmpresaDTO, responsables: ResponsableItem[]) {
    // 1. Actualizar datos de empresa
    const { error: errorEmpresa } = await actualizarEmpresaRepo(id_empresa, datosEmpresa);
    if (errorEmpresa) throw errorEmpresa;

    // 2. Resolver usuarios nuevos (crear persona+usuario)
    const filasAsignacion: { id_usuario: number; id_rol: number; id_empresa: number }[] = [];

    for (const resp of responsables) {
        let id_usuario = resp.id_usuario;

        if (resp.esNuevo && resp.nuevoUsuario) {
            id_usuario = await crearPersonaYUsuario(resp.nuevoUsuario);
        }

        if (!id_usuario) continue;

        for (const id_rol of resp.roles) {
            filasAsignacion.push({ id_usuario, id_rol, id_empresa });
        }
    }

    // 3. Reemplazar asignaciones de roles Médico/SSO para esta empresa
    const { error: errorDelete } = await eliminarAsignacionesPorEmpresaYRoles(id_empresa, [ROLES.MEDICO, ROLES.SSO]);
    if (errorDelete) throw errorDelete;

    if (filasAsignacion.length > 0) {
        const { error: errorAsignacion } = await crearAsignaciones(filasAsignacion);
        if (errorAsignacion) throw errorAsignacion;
    }
}
