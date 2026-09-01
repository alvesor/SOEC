'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useAdministrarEmpresas } from '../hooks/useAdministrarEmpresas';
import EmpresaFormDialog from './EmpresaFormDialog';

const EmpresaListado = () => {
    const toast = useRef<any>(null);
    const hook = useAdministrarEmpresas(toast);
    const { empresas, loading, abrirNuevaEmpresa, abrirEditar } = hook;

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Empresas</h5>
                    <span className="text-color-secondary">Administración de empresas registradas en el sistema</span>
                </div>
                <Button label="Nueva Empresa" icon="pi pi-plus" onClick={abrirNuevaEmpresa} />
            </div>

            <DataTable value={empresas} loading={loading} paginator rows={10} responsiveLayout="scroll" emptyMessage="No hay empresas registradas.">
                <Column field="razon_social" header="Razón Social" sortable />
                <Column field="ruc" header="RUC" sortable />
                <Column field="correo" header="Correo" />
                <Column field="telefono" header="Teléfono" />
                <Column header="Estado" body={(row) => <Tag severity={row.es_activo ? 'success' : 'danger'} value={row.es_activo ? 'Activa' : 'Inactiva'} />} />
                <Column header="" body={(row) => <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Editar" onClick={() => abrirEditar(row)} />} style={{ width: '4rem' }} />
            </DataTable>

            <EmpresaFormDialog hook={hook} />
        </div>
    );
};

export default EmpresaListado;