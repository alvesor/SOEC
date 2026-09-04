// modules/personal/components/PersonalListado.tsx
'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { usePersonal } from '../hooks/usePersonal';
import PersonalFormDialog from './PersonalFormDialog';
import type { PersonalListadoItem } from '../types/personal.types';

const PersonalListado = () => {
    const toast = useRef<any>(null);
    const fileUploadRef = useRef<any>(null);

    const {
        personal,
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
    } = usePersonal(toast);

    async function onSelectFile(event: any) {
        const file = event.files?.[0];
        if (!file) return;
        await cargarExcel(file);
        fileUploadRef.current?.clear();
    }

    function templateEstado(row: PersonalListadoItem) {
        return row.es_activo ? <Tag value="Activo" severity="success" /> : <Tag value="Inactivo" severity="danger" />;
    }

    function templateAcceso(row: PersonalListadoItem) {
        if (!row.id_usuario) return <span className="text-color-secondary">—</span>;
        return row.usuario_activo ? <Tag value="Con acceso" severity="info" /> : <Tag value="Sin acceso" severity="secondary" />;
    }

    function templateAcciones(row: PersonalListadoItem) {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Editar" onClick={() => abrirEditar(row)} />
                <Button
                    icon={row.es_activo ? 'pi pi-ban' : 'pi pi-check'}
                    rounded
                    text
                    severity={row.es_activo ? 'danger' : 'success'}
                    tooltip={row.es_activo ? 'Inhabilitar' : 'Habilitar'}
                    onClick={() =>
                        confirmDialog({
                            message: `¿${row.es_activo ? 'Inhabilitar' : 'Habilitar'} a "${row.nombres} ${row.apellidos}"?`,
                            header: 'Confirmar',
                            icon: 'pi pi-exclamation-triangle',
                            acceptLabel: 'Sí',
                            rejectLabel: 'Cancelar',
                            accept: () => cambiarEstado(row)
                        })
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3 mb-4">
                <div>
                    <h5 className="mb-1">Personal de la Empresa</h5>
                    <span className="text-color-secondary">Registro y control de personal (rol Personal)</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button label="Plantilla Excel" icon="pi pi-download" outlined onClick={descargarPlantilla} />
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        accept=".xlsx"
                        auto
                        chooseLabel={cargaLoading ? 'Procesando...' : 'Cargar Excel'}
                        chooseOptions={{ icon: 'pi pi-upload', disabled: cargaLoading }}
                        customUpload
                        uploadHandler={onSelectFile}
                    />
                    <Button label="Nuevo Personal" icon="pi pi-plus" onClick={abrirNuevo} />
                </div>
            </div>

            <div className="mb-3">
                <span className="p-input-icon-left w-full md:w-4">
                    <i className="pi pi-search" />
                    <InputText value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por identificación, nombres o apellidos..." className="w-full" />
                </span>
            </div>

            {loading && !dialogVisible ? (
                <div className="flex justify-content-center py-6">
                    <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
                </div>
            ) : (
                <DataTable value={personal} paginator rows={10} responsiveLayout="scroll" emptyMessage="No hay personal registrado.">
                    <Column field="identificacion" header="Identificación" sortable />
                    <Column header="Tipo" body={(r: PersonalListadoItem) => r.tipo_identificacion?.nombre ?? '—'} />
                    <Column field="nombres" header="Nombres" sortable />
                    <Column field="apellidos" header="Apellidos" sortable />
                    <Column header="Acceso" body={templateAcceso} style={{ width: '9rem' }} />
                    <Column header="Estado" body={templateEstado} style={{ width: '8rem' }} />
                    <Column header="" body={templateAcciones} style={{ width: '8rem' }} />
                </DataTable>
            )}

            <PersonalFormDialog visible={dialogVisible} loading={loading} formData={formData} setFormData={setFormData} tiposIdentificacion={tiposIdentificacion} onHide={() => setDialogVisible(false)} onGuardar={guardar} />
        </div>
    );
};

export default PersonalListado;