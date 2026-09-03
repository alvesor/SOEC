// modules/rol/hooks/useRolPermisos.ts
'use client';

import { useEffect, useState } from 'react';

import { cargarRoles, crearNuevoRol, actualizarNombreRol, cambiarEstadoRol, cargarArbolMenu, cargarEstadoPermisosRol, guardarPermisosRol } from '../services/rol.service';
import type { MenuTreeNode, Rol, RolForm, SelectedKeysMap } from '../types/rol.types';

export function useRolPermisos(toastRef: React.RefObject<any>) {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [arbolMenu, setArbolMenu] = useState<MenuTreeNode[]>([]);
    const [idRolSeleccionado, setIdRolSeleccionado] = useState<number | null>(null);
    const [selectedKeys, setSelectedKeys] = useState<SelectedKeysMap>({});
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // CRUD rol
    const [rolDialogVisible, setRolDialogVisible] = useState(false);
    const [rolForm, setRolForm] = useState<RolForm>({ nombre: '' });
    const [guardandoRol, setGuardandoRol] = useState(false);

    useEffect(() => {
        inicializar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (idRolSeleccionado && arbolMenu.length > 0) {
            cargarPermisos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idRolSeleccionado, arbolMenu]);

    const rolSeleccionado = roles.find((r) => r.id_rol === idRolSeleccionado) || null;
    const rolActivo = rolSeleccionado?.es_activo ?? true;

    async function inicializar() {
        setLoading(true);
        try {
            const [rolesData, arbol] = await Promise.all([cargarRoles(), cargarArbolMenu()]);

            setRoles(rolesData);
            setArbolMenu(arbol);

            if (rolesData.length > 0) setIdRolSeleccionado(rolesData[0].id_rol);
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar roles o ventanas.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    }

    async function refrescarRoles() {
        const data = await cargarRoles();
        setRoles(data);
        return data;
    }

    async function cargarPermisos() {
        setLoading(true);
        try {
            const estado = await cargarEstadoPermisosRol(idRolSeleccionado!, arbolMenu);
            setSelectedKeys(estado);
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los permisos del rol.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    }

    async function guardar() {
        if (!idRolSeleccionado) return;

        setGuardando(true);
        try {
            await guardarPermisosRol(idRolSeleccionado, selectedKeys);
            toastRef.current?.show({
                severity: 'success',
                summary: 'Guardado',
                detail: 'Permisos actualizados correctamente.',
                life: 3000
            });
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron guardar los permisos.',
                life: 4000
            });
        } finally {
            setGuardando(false);
        }
    }

    // ── CRUD rol ──────────────────────────────────────────────────────────────

    function abrirNuevoRol() {
        setRolForm({ nombre: '' });
        setRolDialogVisible(true);
    }

    function abrirEditarRol(rol: Rol) {
        setRolForm({ id_rol: rol.id_rol, nombre: rol.nombre });
        setRolDialogVisible(true);
    }

    async function guardarRol() {
        if (!rolForm.nombre.trim()) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Ingresa el nombre del rol.', life: 3000 });
            return;
        }

        setGuardandoRol(true);
        try {
            if (rolForm.id_rol) {
                await actualizarNombreRol(rolForm.id_rol, rolForm.nombre);
                toastRef.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Rol actualizado correctamente.', life: 3000 });
            } else {
                const nuevo = await crearNuevoRol(rolForm.nombre);
                setIdRolSeleccionado(nuevo.id_rol);
                toastRef.current?.show({ severity: 'success', summary: 'Creado', detail: 'Rol creado correctamente.', life: 3000 });
            }

            setRolDialogVisible(false);
            await refrescarRoles();
        } catch (error: any) {
            const detail = error?.code === '23505' ? 'Ya existe un rol con ese nombre.' : 'No se pudo guardar el rol.';
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail, life: 4000 });
        } finally {
            setGuardandoRol(false);
        }
    }

    async function toggleEstadoRol(rol: Rol) {
        try {
            await cambiarEstadoRol(rol.id_rol, !rol.es_activo);
            toastRef.current?.show({
                severity: 'success',
                summary: rol.es_activo ? 'Rol deshabilitado' : 'Rol habilitado',
                detail: `"${rol.nombre}" ahora está ${rol.es_activo ? 'inactivo' : 'activo'}.`,
                life: 3000
            });
            await refrescarRoles();
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cambiar el estado del rol.',
                life: 4000
            });
        }
    }

    return {
        roles,
        arbolMenu,
        idRolSeleccionado,
        setIdRolSeleccionado,
        rolActivo,
        selectedKeys,
        setSelectedKeys,
        loading,
        guardando,
        guardar,
        // CRUD rol
        rolDialogVisible,
        setRolDialogVisible,
        rolForm,
        setRolForm,
        guardandoRol,
        abrirNuevoRol,
        abrirEditarRol,
        guardarRol,
        toggleEstadoRol
    };
}
