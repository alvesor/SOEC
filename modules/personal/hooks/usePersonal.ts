// modules/personal/hooks/usePersonal.ts
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cargarTiposIdentificacion, cargarPersonalEmpresa, guardarPersonal, cambiarEstadoPersonal } from '../services/personal.service';
import { generarPlantillaExcel, leerArchivoCargaMasiva, procesarCargaMasiva } from '../services/personal-excel.service';
import type { PersonalForm, PersonalListadoItem, CatalogoItem, ResultadoCargaMasiva } from '../types/personal.types';

export function usePersonal(toastRef: React.RefObject<any>) {
    const { data: session } = useSession();
    const id_empresa = session?.user?.empresa_activa?.id_empresa;
    const razonSocial = session?.user?.empresa_activa?.razon_social ?? 'empresa';

    const [personal, setPersonal] = useState<PersonalListadoItem[]>([]);
    const [tiposIdentificacion, setTiposIdentificacion] = useState<CatalogoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [cargaLoading, setCargaLoading] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [formData, setFormData] = useState<PersonalForm>(formVacio());

    useEffect(() => {
        if (!id_empresa) return;
        cargarTodo();
    }, [id_empresa]);

    function formVacio(): PersonalForm {
        return { id_persona: undefined, id_tipo_identificacion: null, identificacion: '', nombres: '', apellidos: '', requiere_acceso: false };
    }

    async function cargarTodo() {
        setLoading(true);
        try {
            const [lista, tipos] = await Promise.all([cargarPersonalEmpresa(id_empresa), cargarTiposIdentificacion()]);
            setPersonal(lista);
            setTiposIdentificacion(tipos);
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el personal.', life: 4000 });
        } finally {
            setLoading(false);
        }
    }

    function abrirNuevo() {
        setFormData(formVacio());
        setDialogVisible(true);
    }

    function abrirEditar(row: PersonalListadoItem) {
        setFormData({
            id_persona: row.id_persona,
            id_tipo_identificacion: row.tipo_identificacion?.id_catalogo ?? null,
            identificacion: row.identificacion,
            nombres: row.nombres,
            apellidos: row.apellidos,
            requiere_acceso: !!row.usuario_activo
        });
        setDialogVisible(true);
    }

    async function guardar() {
        if (!formData.id_tipo_identificacion || !formData.identificacion.trim() || !formData.nombres.trim() || !formData.apellidos.trim()) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Completa tipo de identificación, identificación, nombres y apellidos.', life: 3000 });
            return;
        }
        setLoading(true);
        try {
            await guardarPersonal(id_empresa, formData);
            toastRef.current?.show({ severity: 'success', summary: 'Guardado', detail: 'Personal registrado correctamente.', life: 3000 });
            setDialogVisible(false);
            await cargarTodo();
        } catch (err: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: err.message ?? 'No se pudo guardar.', life: 4000 });
        } finally {
            setLoading(false);
        }
    }

    async function cambiarEstado(row: PersonalListadoItem) {
        try {
            await cambiarEstadoPersonal(row.id_persona, !row.es_activo);
            setPersonal((prev) => prev.map((p) => (p.id_persona === row.id_persona ? { ...p, es_activo: !p.es_activo } : p)));
            toastRef.current?.show({ severity: 'success', summary: row.es_activo ? 'Inhabilitado' : 'Habilitado', detail: `${row.nombres} ${row.apellidos}`, life: 3000 });
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado.', life: 3000 });
        }
    }

    async function descargarPlantilla() {
        try {
            await generarPlantillaExcel(id_empresa, razonSocial, tiposIdentificacion);
        } catch (err: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: err.message ?? 'No se pudo generar la plantilla.', life: 4000 });
        }
    }

    async function cargarExcel(file: File) {
        setCargaLoading(true);
        try {
            const { id_empresa: idEmpresaArchivo, filas } = await leerArchivoCargaMasiva(file);

            if (idEmpresaArchivo !== id_empresa) {
                toastRef.current?.show({ severity: 'error', summary: 'Archivo no válido', detail: 'La plantilla pertenece a otra empresa.', life: 5000 });
                return;
            }
            if (filas.length === 0) {
                toastRef.current?.show({ severity: 'warn', summary: 'Sin datos', detail: 'El archivo no tiene filas para procesar.', life: 3000 });
                return;
            }

            const resultado: ResultadoCargaMasiva = await procesarCargaMasiva(id_empresa, filas, tiposIdentificacion);

            toastRef.current?.show({
                severity: resultado.errores.length === 0 ? 'success' : 'warn',
                summary: 'Carga masiva finalizada',
                detail: `${resultado.exitos} registrados, ${resultado.errores.length} con error.`,
                life: 6000
            });

            await cargarTodo();
        } catch (err: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error al procesar archivo', detail: err.message ?? 'Verifica el formato.', life: 5000 });
        } finally {
            setCargaLoading(false);
        }
    }

    const personalFiltrado = personal.filter((p) => `${p.identificacion} ${p.nombres} ${p.apellidos}`.toLowerCase().includes(filtro.toLowerCase()));

    return {
        personal: personalFiltrado,
        tiposIdentificacion,
        loading,
        cargaLoading,
        filtro,
        setFiltro,
        dialogVisible,
        setDialogVisible,
        formData,
        setFormData,
        abrirNuevo,
        abrirEditar,
        guardar,
        cambiarEstado,
        descargarPlantilla,
        cargarExcel
    };
}
