// modules/personal/services/personal.service.ts

import { hashPassword } from '@/lib/security';
import {
    obtenerTiposIdentificacion,
    obtenerPersonalEmpresa,
    buscarPersonaPorIdentificacion,
    crearPersona,
    actualizarPersona,
    actualizarEstadoPersona,
    obtenerUsuarioPorPersona,
    crearUsuario,
    existeAsignacion,
    crearAsignacion
} from '../repositories/personal.repository';
import type { PersonalForm, PersonalListadoItem, CatalogoItem } from '../types/personal.types';

export async function cargarTiposIdentificacion(): Promise<CatalogoItem[]> {
    const { data, error } = await obtenerTiposIdentificacion();
    if (error) throw error;
    return data ?? [];
}

export async function cargarPersonalEmpresa(id_empresa: number): Promise<PersonalListadoItem[]> {
    const { data, error } = await obtenerPersonalEmpresa(id_empresa);
    if (error) throw error;

    return (data ?? [])
        .map((row: any) => {
            const usuario = Array.isArray(row.usuario) ? row.usuario[0] : row.usuario;
            const persona = Array.isArray(usuario?.persona) ? usuario.persona[0] : usuario?.persona;

            return {
                id_persona: persona?.id_persona,
                identificacion: persona?.identificacion,
                nombres: persona?.nombres,
                apellidos: persona?.apellidos,
                es_activo: persona?.es_activo,
                tipo_identificacion: Array.isArray(persona?.tipo_identificacion) ? persona.tipo_identificacion[0] : persona?.tipo_identificacion,
                id_usuario: usuario?.id_usuario ?? null,
                usuario_activo: usuario?.es_activo ?? false
            };
        })
        .filter((p: PersonalListadoItem) => !!p.id_persona);
}

/*
 * Vincula (o crea) persona + usuario + asignación
 * a la empresa activa con rol Personal (id_rol=4)
 */
export async function guardarPersonal(id_empresa: number, form: PersonalForm) {
    let id_persona = form.id_persona;

    if (id_persona) {
        // Edición: solo datos de persona
        const { error } = await actualizarPersona(id_persona, {
            id_tipo_identificacion: form.id_tipo_identificacion!,
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim()
        });
        if (error) throw error;
    } else {
        // Alta: reutilizar persona si ya existe (pudo registrarse en otro rol/empresa)
        const { data: existente, error: errorBusqueda } = await buscarPersonaPorIdentificacion(form.identificacion.trim());
        if (errorBusqueda) throw errorBusqueda;

        if (existente) {
            id_persona = existente.id_persona;
        } else {
            const { data: nueva, error: errorCrear } = await crearPersona({
                id_tipo_identificacion: form.id_tipo_identificacion!,
                identificacion: form.identificacion.trim(),
                nombres: form.nombres.trim(),
                apellidos: form.apellidos.trim()
            });
            if (errorCrear) throw errorCrear;
            id_persona = nueva.id_persona;
        }
    }

    // Usuario: se crea solo si no existe (FK de asignacion lo exige).
    // Si no requiere acceso, se crea igual pero inactivo.
    const { data: usuarioExistente } = await obtenerUsuarioPorPersona(id_persona!);
    let id_usuario = usuarioExistente?.id_usuario;

    if (!id_usuario) {
        const clave = await hashPassword(form.identificacion.trim());
        const { data: nuevoUsuario, error: errorUsuario } = await crearUsuario({
            id_persona: id_persona!,
            clave,
            es_activo: form.requiere_acceso
        });
        if (errorUsuario) throw errorUsuario;
        id_usuario = nuevoUsuario.id_usuario;
    }

    const { data: asignacionExistente } = await existeAsignacion(id_usuario!, id_empresa);
    if (!asignacionExistente) {
        const { error: errorAsignacion } = await crearAsignacion(id_usuario!, id_empresa);
        if (errorAsignacion) throw errorAsignacion;
    }

    return id_persona;
}

export async function cambiarEstadoPersonal(id_persona: number, es_activo: boolean) {
    const { error } = await actualizarEstadoPersona(id_persona, es_activo);
    if (error) throw error;
}
