'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { ROLES } from '../constants';
import ResponsableDialog from './ResponsableDialog';

const ROL_LABEL: Record<number, string> = {
    [ROLES.MEDICO]: 'Médico',
    [ROLES.SSO]: 'SSO'
};

interface Props {
    hook: ReturnType<typeof import('../hooks/useAdministrarEmpresas').useAdministrarEmpresas>;
}

const EmpresaFormDialog = ({ hook }: Props) => {
    const {
        dialogVisible,
        setDialogVisible,
        formEmpresa,
        setFormEmpresa,
        responsables,
        quitarResponsable,
        abrirAgregarResponsable,
        guardarEmpresa,
        guardando,
        modoEdicion,
        loadingDialog
    } = hook;

    return (
        <>
            <Dialog
                header={modoEdicion ? 'Editar empresa' : 'Nueva empresa'}
                visible={dialogVisible}
                style={{ width: '640px' }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setDialogVisible(false)} />
                        <Button label="Guardar" icon="pi pi-check" loading={guardando} disabled={loadingDialog} onClick={guardarEmpresa} />
                    </div>
                }
            >
                {loadingDialog ? (
                    <div className="flex justify-content-center py-6">
                        <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
                    </div>
                ) : (
                    <div className="flex flex-column gap-4 pt-2">
                        <div>
                            <p className="text-xs font-bold text-color-secondary uppercase mb-3">Datos de la empresa</p>
                            <div className="grid">
                                <div className="col-12 md:col-6 flex flex-column gap-2">
                                    <label className="font-medium">
                                        Razón social <span className="text-red-500">*</span>
                                    </label>
                                    <InputText value={formEmpresa.razon_social} onChange={(e) => setFormEmpresa((prev) => ({ ...prev, razon_social: e.target.value }))} />
                                </div>
                                <div className="col-12 md:col-6 flex flex-column gap-2">
                                    <label className="font-medium">
                                        RUC <span className="text-red-500">*</span>
                                    </label>
                                    <InputText value={formEmpresa.ruc} onChange={(e) => setFormEmpresa((prev) => ({ ...prev, ruc: e.target.value }))} />
                                </div>
                                <div className="col-12 md:col-6 flex flex-column gap-2">
                                    <label className="font-medium">Correo</label>
                                    <InputText value={formEmpresa.correo} onChange={(e) => setFormEmpresa((prev) => ({ ...prev, correo: e.target.value }))} />
                                </div>
                                <div className="col-12 md:col-6 flex flex-column gap-2">
                                    <label className="font-medium">Teléfono</label>
                                    <InputText value={formEmpresa.telefono} onChange={(e) => setFormEmpresa((prev) => ({ ...prev, telefono: e.target.value }))} />
                                </div>
                            </div>
                            <small className="text-color-secondary">Datos adicionales (descripción, logo) se completan luego en la ficha de la empresa.</small>
                        </div>

                        <div>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <p className="text-xs font-bold text-color-secondary uppercase m-0">Personal responsable</p>
                                <Button label="Agregar responsable" icon="pi pi-plus" text size="small" onClick={abrirAgregarResponsable} />
                            </div>

                            <DataTable value={responsables} emptyMessage="Aún no hay responsables agregados." size="small">
                                <Column field="nombreCompleto" header="Nombre" />
                                <Column field="identificacion" header="Identificación" />
                                <Column
                                    header="Rol(es)"
                                    body={(row) => (
                                        <div className="flex gap-1">
                                            {row.roles.map((r: number) => (
                                                <Tag key={r} value={ROL_LABEL[r] ?? r} />
                                            ))}
                                        </div>
                                    )}
                                />
                                <Column header="Origen" body={(row) => (row.esNuevo ? <Tag severity="warning" value="Nuevo" /> : <Tag severity="info" value="Existente" />)} />
                                <Column header="" body={(row) => <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => quitarResponsable(row.key)} />} style={{ width: '3rem' }} />
                            </DataTable>
                        </div>
                    </div>
                )}
            </Dialog>

            <ResponsableDialog hook={hook} />
        </>
    );
};

export default EmpresaFormDialog;