'use client';

import { useEffect, useState } from 'react';
import { listarEmpresas, crearEmpresaConResponsables, cargarEmpresaConResponsables, actualizarEmpresaConResponsables } from '../services/empresa.service';
import { buscarUsuarios, cargarTiposIdentificacion } from '@/modules/usuario/services/usuario.service';
import type { CrearEmpresaDTO, ResponsableItem } from '../types/empresa.types';
import type { UsuarioBusqueda, TipoIdentificacion, CrearPersonaUsuarioDTO } from '@/modules/usuario/types/usuario.types';

function empresaVacia(): CrearEmpresaDTO {
    return { razon_social: '', ruc: '', correo: '', telefono: '' };
}

function nuevoUsuarioVacio(): CrearPersonaUsuarioDTO {
    return { id_tipo_identificacion: 0, identificacion: '', nombres: '', apellidos: '', clave: '' };
}

export function useAdministrarEmpresas(toastRef: React.RefObject<any>) {
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEmpresaEditando, setIdEmpresaEditando] = useState<number | null>(null);
    const [formEmpresa, setFormEmpresa] = useState<CrearEmpresaDTO>(empresaVacia());
    const [responsables, setResponsables] = useState<ResponsableItem[]>([]);

    const [responsableDialogVisible, setResponsableDialogVisible] = useState(false);
    const [modoResponsable, setModoResponsable] = useState<'buscar' | 'nuevo'>('buscar');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState<UsuarioBusqueda[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioBusqueda | null>(null);
    const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
    const [nuevoUsuarioForm, setNuevoUsuarioForm] = useState<CrearPersonaUsuarioDTO>(nuevoUsuarioVacio());
    const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

    useEffect(() => {
        cargarEmpresas();
    }, []);

    async function cargarEmpresas() {
        setLoading(true);
        try {
            setEmpresas(await listarEmpresas());
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las empresas.', life: 4000 });
        } finally {
            setLoading(false);
        }
    }

    function abrirNuevaEmpresa() {
        setModoEdicion(false);
        setIdEmpresaEditando(null);
        setFormEmpresa(empresaVacia());
        setResponsables([]);
        setDialogVisible(true);
    }

    async function abrirEditar(row: any) {
        setModoEdicion(true);
        setIdEmpresaEditando(row.id_empresa);
        setDialogVisible(true);
        setLoadingDialog(true);

        try {
            const { empresa, responsables: resp } = await cargarEmpresaConResponsables(row.id_empresa);
            setFormEmpresa({
                razon_social: empresa.razon_social ?? '',
                ruc: empresa.ruc ?? '',
                correo: empresa.correo ?? '',
                telefono: empresa.telefono ?? ''
            });
            setResponsables(resp);
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la empresa.', life: 4000 });
            setDialogVisible(false);
        } finally {
            setLoadingDialog(false);
        }
    }

    function abrirAgregarResponsable() {
        setModoResponsable('buscar');
        setBusquedaTexto('');
        setResultadosBusqueda([]);
        setUsuarioSeleccionado(null);
        setNuevoUsuarioForm(nuevoUsuarioVacio());
        setRolesSeleccionados([]);
        setResponsableDialogVisible(true);

        if (tiposIdentificacion.length === 0) {
            cargarTiposIdentificacion()
                .then(setTiposIdentificacion)
                .catch(() => {});
        }
    }

    async function buscarResponsable(texto: string) {
        setBusquedaTexto(texto);
        setUsuarioSeleccionado(null);

        if (texto.trim().length < 2) {
            setResultadosBusqueda([]);
            return;
        }

        setBuscando(true);
        try {
            setResultadosBusqueda(await buscarUsuarios(texto));
        } catch {
            // silencioso
        } finally {
            setBuscando(false);
        }
    }

    function confirmarResponsable() {
        if (rolesSeleccionados.length === 0) {
            toastRef.current?.show({ severity: 'warn', summary: 'Rol requerido', detail: 'Selecciona al menos un rol (Médico o SSO).', life: 3000 });
            return;
        }

        if (modoResponsable === 'buscar') {
            if (!usuarioSeleccionado) {
                toastRef.current?.show({ severity: 'warn', summary: 'Selecciona un usuario', detail: 'Busca y selecciona un usuario existente.', life: 3000 });
                return;
            }
            if (responsables.some((r) => r.id_usuario === usuarioSeleccionado.id_usuario)) {
                toastRef.current?.show({ severity: 'warn', summary: 'Ya agregado', detail: 'Este usuario ya está en la lista.', life: 3000 });
                return;
            }

            setResponsables((prev) => [
                ...prev,
                {
                    key: `u-${usuarioSeleccionado.id_usuario}`,
                    esNuevo: false,
                    id_usuario: usuarioSeleccionado.id_usuario,
                    nombreCompleto: `${usuarioSeleccionado.nombres} ${usuarioSeleccionado.apellidos}`,
                    identificacion: usuarioSeleccionado.identificacion,
                    roles: rolesSeleccionados
                }
            ]);
        } else {
            const { identificacion, nombres, apellidos, clave, id_tipo_identificacion } = nuevoUsuarioForm;

            if (!identificacion.trim() || !nombres.trim() || !apellidos.trim() || !clave.trim() || !id_tipo_identificacion) {
                toastRef.current?.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Completa todos los datos del nuevo responsable.', life: 3000 });
                return;
            }

            setResponsables((prev) => [
                ...prev,
                {
                    key: `n-${Date.now()}`,
                    esNuevo: true,
                    nombreCompleto: `${nombres} ${apellidos}`,
                    identificacion,
                    roles: rolesSeleccionados,
                    nuevoUsuario: { ...nuevoUsuarioForm }
                }
            ]);
        }

        setResponsableDialogVisible(false);
    }

    function quitarResponsable(key: string) {
        setResponsables((prev) => prev.filter((r) => r.key !== key));
    }

    async function guardarEmpresa() {
        if (!formEmpresa.razon_social.trim() || !formEmpresa.ruc.trim()) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Razón social y RUC son obligatorios.', life: 3000 });
            return;
        }

        setGuardando(true);
        try {
            if (modoEdicion && idEmpresaEditando) {
                await actualizarEmpresaConResponsables(idEmpresaEditando, formEmpresa, responsables);
                toastRef.current?.show({ severity: 'success', summary: 'Empresa actualizada', detail: 'Los cambios se guardaron correctamente.', life: 3000 });
            } else {
                await crearEmpresaConResponsables(formEmpresa, responsables);
                toastRef.current?.show({ severity: 'success', summary: 'Empresa creada', detail: 'La empresa se registró correctamente.', life: 3000 });
            }
            setDialogVisible(false);
            await cargarEmpresas();
        } catch (e: any) {
            const detalle = e?.code === '23505' ? 'El RUC ya está registrado.' : 'No se pudo guardar la empresa.';
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: detalle, life: 4000 });
        } finally {
            setGuardando(false);
        }
    }

    return {
        empresas,
        loading,
        guardando,
        loadingDialog,
        dialogVisible,
        setDialogVisible,
        modoEdicion,
        formEmpresa,
        setFormEmpresa,
        responsables,
        abrirNuevaEmpresa,
        abrirEditar,
        guardarEmpresa,
        quitarResponsable,

        responsableDialogVisible,
        setResponsableDialogVisible,
        modoResponsable,
        setModoResponsable,
        busquedaTexto,
        resultadosBusqueda,
        buscando,
        buscarResponsable,
        usuarioSeleccionado,
        setUsuarioSeleccionado,
        tiposIdentificacion,
        nuevoUsuarioForm,
        setNuevoUsuarioForm,
        rolesSeleccionados,
        setRolesSeleccionados,
        abrirAgregarResponsable,
        confirmarResponsable
    };
}
