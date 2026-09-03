import { hashPassword } from '@/lib/security';
import { buscarUsuariosActivos, obtenerRaizCatalogoPorNombre, obtenerCatalogoPorPadre, crearPersona, crearUsuario } from '../repositories/usuario.repository';
import type { UsuarioBusqueda, CrearPersonaUsuarioDTO, TipoIdentificacion } from '../types/usuario.types';

import { obtenerResponsablesPorEmpresa } from '../repositories/usuario.repository';
import { ROLES } from '@/modules/empresa/constants';
import type { ResponsableItem } from '@/modules/empresa/types/empresa.types';

// Ajusta si el nodo raíz en `catalogo` tiene otro nombre exacto
const ID_CATALOGO_TIPO_IDENTIFICACION = 2;

export async function buscarUsuarios(texto: string): Promise<UsuarioBusqueda[]> {
    if (!texto || texto.trim().length < 2) return [];

    const { data, error } = await buscarUsuariosActivos(texto.trim());
    if (error) throw error;

    return (data ?? [])
        .map((p: any) => {
            const usuarioRow = Array.isArray(p.usuario) ? p.usuario[0] : p.usuario;
            return {
                id_usuario: usuarioRow?.id_usuario,
                id_persona: p.id_persona,
                identificacion: p.identificacion,
                nombres: p.nombres,
                apellidos: p.apellidos
            };
        })
        .filter((u: any) => !!u.id_usuario);
}

export async function cargarTiposIdentificacion(): Promise<TipoIdentificacion[]> {
    const { data, error } = await obtenerCatalogoPorPadre(ID_CATALOGO_TIPO_IDENTIFICACION);
    if (error) throw error;
    return data ?? [];
}

export async function crearPersonaYUsuario(dto: CrearPersonaUsuarioDTO): Promise<number> {
    const { data: persona, error: errorPersona } = await crearPersona({
        id_tipo_identificacion: dto.id_tipo_identificacion,
        identificacion: dto.identificacion,
        nombres: dto.nombres,
        apellidos: dto.apellidos
    });
    if (errorPersona) throw errorPersona;

    const claveHash = await hashPassword(dto.clave);

    const { data: usuario, error: errorUsuario } = await crearUsuario({
        id_persona: persona.id_persona,
        clave: claveHash
    });
    if (errorUsuario) throw errorUsuario;

    return usuario.id_usuario;
}

export async function cargarResponsablesEmpresa(id_empresa: number): Promise<ResponsableItem[]> {
    console.log('antes de await obtenerResponsablesPorEmpresa');
    const { data, error } = await obtenerResponsablesPorEmpresa(id_empresa, [ROLES.MEDICO, ROLES.SSO]);
    console.log(data, error);
    if (error) throw error;

    // Agrupar por usuario: una persona puede tener ambos roles (Médico + SSO)
    const mapa = new Map<number, ResponsableItem>();
    console.log('antes de (data ?? []).forEach((fila: any)');
    (data ?? []).forEach((fila: any) => {
        const u = fila.usuario;
        const p = u?.persona;
        if (!u || !p) {
            console.warn('Fila descartada (usuario o persona null):', fila);
            return;
        }

        if (!mapa.has(u.id_usuario)) {
            mapa.set(u.id_usuario, {
                key: `u-${u.id_usuario}`,
                esNuevo: false,
                id_usuario: u.id_usuario,
                nombreCompleto: `${p.nombres} ${p.apellidos}`,
                identificacion: p.identificacion,
                roles: []
            });
        }

        mapa.get(u.id_usuario)!.roles.push(fila.id_rol);
    });

    return Array.from(mapa.values());
}
