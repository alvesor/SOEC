// modules/atributo/hooks/useAtributo.ts
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    cargarAtributosEmpresa,
    cargarAtributos,
    cargarTiposDato,
    cargarCategoriasAtributo,
    cargarTiposCiclo,
    cargarCatalogosLov,
    crearListaLov,
    agregarAtributoAEmpresa,
    actualizarAtributoDeEmpresa,
    eliminarAtributoDeEmpresa,
    crearNuevoAtributo,
    actualizarAtributoGlobal
} from '../services/atributo.service';
import type { AtributoMedicoEmpresarial, AtributoForm, CatalogoItem } from '../types/atributo.types';

export interface LovForm {
    nombre: string;
    opciones: string[];
}

export function useAtributo(toastRef: React.RefObject<any>) {
    const { data: session } = useSession();
    const id_empresa = session?.user?.empresa_activa?.id_empresa;

    const [atributosEmpresa, setAtributosEmpresa] = useState<AtributoMedicoEmpresarial[]>([]);
    const [atributosGlobales, setAtributosGlobales] = useState<any[]>([]);
    const [tiposDato, setTiposDato] = useState<CatalogoItem[]>([]);
    const [categorias, setCategorias] = useState<CatalogoItem[]>([]);
    const [tiposCiclo, setTiposCiclo] = useState<CatalogoItem[]>([]);
    const [catalogosLov, setCatalogosLov] = useState<CatalogoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [lovDialogVisible, setLovDialogVisible] = useState(false);
    const [lovLoading, setLovLoading] = useState(false);
    const [lovForm, setLovForm] = useState<LovForm>(lovFormVacio());
    const [formData, setFormData] = useState<AtributoForm>(formVacio());

    useEffect(() => {
        if (!id_empresa) return;
        cargarTodo();
    }, [id_empresa]);

    function formVacio(): AtributoForm {
        return {
            id_atributo_medico_empresarial: undefined,
            es_requerido: false,
            es_visible: true,
            es_editable: true,
            orden: 0,
            id_atributo: null,
            esNuevoAtributo: false,
            nombre: '',
            id_tipo_dato: null,
            id_lov: null,
            id_categoria: null,
            id_tipo_ciclo: null,
            requiere_vigencia: false
        };
    }

    function lovFormVacio(): LovForm {
        return { nombre: '', opciones: [''] };
    }

    async function cargarTodo() {
        setLoading(true);
        try {
            const [empresa, globales, tipos, cats, ciclos, lovs] = await Promise.all([cargarAtributosEmpresa(id_empresa), cargarAtributos(), cargarTiposDato(), cargarCategoriasAtributo(), cargarTiposCiclo(), cargarCatalogosLov()]);
            setAtributosEmpresa(empresa as AtributoMedicoEmpresarial[]);
            setAtributosGlobales(globales);
            setTiposDato(tipos as CatalogoItem[]);
            setCategorias(cats as CatalogoItem[]);
            setTiposCiclo(ciclos as CatalogoItem[]);
            setCatalogosLov(lovs as CatalogoItem[]);
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los atributos.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    }

    function abrirNuevo() {
        setFormData(formVacio());
        setDialogVisible(true);
    }

    function abrirEditar(row: AtributoMedicoEmpresarial) {
        const atr = row.atributo as any;
        setFormData({
            id_atributo_medico_empresarial: row.id_atributo_medico_empresarial,
            es_requerido: row.es_requerido,
            es_visible: row.es_visible,
            es_editable: row.es_editable,
            orden: row.orden,
            id_atributo: row.id_atributo,
            esNuevoAtributo: false,
            nombre: atr?.nombre ?? '',
            id_tipo_dato: atr?.id_tipo_dato ?? null,
            id_lov: atr?.id_lov ?? null,
            id_categoria: atr?.id_categoria ?? null,
            id_tipo_ciclo: atr?.id_tipo_ciclo ?? null,
            requiere_vigencia: atr?.requiere_vigencia ?? false
        });
        setDialogVisible(true);
    }

    // ── LOV dialog ────────────────────────────────────────────────────────────

    function abrirLovDialog() {
        setLovForm(lovFormVacio());
        setLovDialogVisible(true);
    }

    function agregarOpcionLov() {
        setLovForm((prev) => ({ ...prev, opciones: [...prev.opciones, ''] }));
    }

    function actualizarOpcionLov(index: number, valor: string) {
        setLovForm((prev) => {
            const opciones = [...prev.opciones];
            opciones[index] = valor;
            return { ...prev, opciones };
        });
    }

    function eliminarOpcionLov(index: number) {
        setLovForm((prev) => ({
            ...prev,
            opciones: prev.opciones.filter((_, i) => i !== index)
        }));
    }

    async function guardarLov() {
        if (!lovForm.nombre.trim()) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Campo requerido',
                detail: 'Ingresa el nombre de la lista.',
                life: 3000
            });
            return;
        }
        const opcionesValidas = lovForm.opciones.filter((o) => o.trim());
        if (opcionesValidas.length === 0) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Sin opciones',
                detail: 'Agrega al menos una opción a la lista.',
                life: 3000
            });
            return;
        }
        setLovLoading(true);
        try {
            const nuevo = await crearListaLov(lovForm.nombre.trim(), opcionesValidas);
            // Recargar LOVs y seleccionar el nuevo automáticamente
            const lovs = await cargarCatalogosLov();
            setCatalogosLov(lovs as CatalogoItem[]);
            setFormData((prev) => ({ ...prev, id_lov: nuevo.id_catalogo }));
            setLovDialogVisible(false);
            toastRef.current?.show({
                severity: 'success',
                summary: 'Lista creada',
                detail: `"${lovForm.nombre}" creada y seleccionada.`,
                life: 3000
            });
        } catch {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear la lista.',
                life: 4000
            });
        } finally {
            setLovLoading(false);
        }
    }

    // ── Guardar atributo ──────────────────────────────────────────────────────

    async function guardar() {
        if (!formData.esNuevoAtributo && !formData.id_atributo) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Selecciona o crea un atributo.', life: 3000 });
            return;
        }
        if (formData.esNuevoAtributo && !formData.nombre.trim()) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Ingresa el nombre del atributo.', life: 3000 });
            return;
        }
        if (!formData.id_tipo_dato) {
            toastRef.current?.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Selecciona el tipo de dato.', life: 3000 });
            return;
        }

        setLoading(true);
        try {
            let id_atributo = formData.id_atributo;

            if (formData.esNuevoAtributo) {
                const nuevo = await crearNuevoAtributo({
                    nombre: formData.nombre.trim(),
                    id_tipo_dato: formData.id_tipo_dato,
                    id_lov: formData.id_lov ?? null,
                    id_categoria: formData.id_categoria ?? null,
                    id_tipo_ciclo: formData.id_tipo_ciclo ?? null,
                    requiere_vigencia: formData.requiere_vigencia
                });
                id_atributo = nuevo.id_atributo;
            } else if (formData.id_atributo_medico_empresarial) {
                await actualizarAtributoGlobal(formData.id_atributo!, {
                    id_categoria: formData.id_categoria ?? undefined,
                    id_tipo_ciclo: formData.id_tipo_ciclo ?? undefined,
                    id_lov: formData.id_lov ?? undefined,
                    requiere_vigencia: formData.requiere_vigencia
                });
            }

            if (formData.id_atributo_medico_empresarial) {
                await actualizarAtributoDeEmpresa(formData.id_atributo_medico_empresarial, {
                    es_requerido: formData.es_requerido,
                    es_visible: formData.es_visible,
                    es_editable: formData.es_editable,
                    orden: formData.orden
                });
            } else {
                await agregarAtributoAEmpresa({
                    id_empresa,
                    id_atributo: id_atributo!,
                    es_requerido: formData.es_requerido,
                    es_visible: formData.es_visible,
                    es_editable: formData.es_editable,
                    orden: formData.orden
                });
            }

            toastRef.current?.show({ severity: 'success', summary: 'Guardado', detail: 'Atributo configurado correctamente.', life: 3000 });
            setDialogVisible(false);
            await cargarTodo();
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el atributo.', life: 4000 });
        } finally {
            setLoading(false);
        }
    }

    async function eliminar(id_atributo_medico_empresarial: number) {
        setLoading(true);
        try {
            await eliminarAtributoDeEmpresa(id_atributo_medico_empresarial);
            toastRef.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Atributo removido de la empresa.', life: 3000 });
            await cargarTodo();
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el atributo.', life: 4000 });
        } finally {
            setLoading(false);
        }
    }

    async function toggleCampo(id_atributo_medico_empresarial: number, campo: 'es_visible' | 'es_requerido' | 'es_editable', valor: boolean) {
        try {
            await actualizarAtributoDeEmpresa(id_atributo_medico_empresarial, { [campo]: valor });
            setAtributosEmpresa((prev) => prev.map((a) => (a.id_atributo_medico_empresarial === id_atributo_medico_empresarial ? { ...a, [campo]: valor } : a)));
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar.', life: 3000 });
        }
    }

    return {
        atributosEmpresa,
        atributosGlobales,
        tiposDato,
        categorias,
        tiposCiclo,
        catalogosLov,
        loading,
        dialogVisible,
        setDialogVisible,
        lovDialogVisible,
        setLovDialogVisible,
        lovLoading,
        lovForm,
        setLovForm,
        formData,
        setFormData,
        abrirNuevo,
        abrirEditar,
        guardar,
        eliminar,
        toggleCampo,
        abrirLovDialog,
        agregarOpcionLov,
        actualizarOpcionLov,
        eliminarOpcionLov,
        guardarLov
    };
}
