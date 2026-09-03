// modules/rol/components/RolPermisosPanel.tsx
'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Tree } from 'primereact/tree';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { useRolPermisos } from '@/modules/rol/hooks/useRolPermisos';
import type { Rol } from '@/modules/rol/types/rol.types';

const RolPermisosPanel = () => {
    const toast = useRef<any>(null);

    const {
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
        rolDialogVisible,
        setRolDialogVisible,
        rolForm,
        setRolForm,
        guardandoRol,
        abrirNuevoRol,
        abrirEditarRol,
        guardarRol,
        toggleEstadoRol
    } = useRolPermisos(toast);

    function confirmarToggleEstado(rol: Rol) {
        if (!rol.es_activo) {
            // Reactivar: sin confirmación
            toggleEstadoRol(rol);
            return;
        }

        confirmDialog({
            message: `¿Deshabilitar el rol "${rol.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, deshabilitar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: () => toggleEstadoRol(rol)
        });
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Lista de roles */}
            <div className="col-12 md:col-3">
                <div className="surface-card border-round p-3 h-full">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <p className="text-xs font-bold text-color-secondary uppercase m-0">Roles</p>
                        <Button icon="pi pi-plus" rounded text size="small" tooltip="Nuevo rol" onClick={abrirNuevoRol} />
                    </div>

                    {loading && roles.length === 0 ? (
                        <div className="flex justify-content-center py-4">
                            <ProgressSpinner style={{ width: '32px', height: '32px' }} strokeWidth="4" />
                        </div>
                    ) : (
                        <div className="flex flex-column gap-1">
                            {roles.map((rol) => (
                                <div
                                    key={rol.id_rol}
                                    className={classNames('flex align-items-center justify-content-between p-2 border-round gap-2', {
                                        'bg-primary text-white': idRolSeleccionado === rol.id_rol,
                                        'surface-hover': idRolSeleccionado !== rol.id_rol,
                                        'opacity-60': !rol.es_activo
                                    })}
                                >
                                    <button
                                        onClick={() => setIdRolSeleccionado(rol.id_rol)}
                                        className="border-none bg-transparent p-0 flex-1 text-left cursor-pointer"
                                        style={{ color: 'inherit' }}
                                    >
                                        {rol.nombre}
                                        {!rol.es_activo && <Tag value="Inactivo" severity="danger" className="ml-2" style={{ fontSize: '0.65rem' }} />}
                                    </button>

                                    <div className="flex gap-1">
                                        <Button
                                            icon="pi pi-pencil"
                                            rounded text size="small"
                                            tooltip="Editar nombre"
                                            onClick={() => abrirEditarRol(rol)}
                                        />
                                        <Button
                                            icon={rol.es_activo ? 'pi pi-ban' : 'pi pi-check-circle'}
                                            rounded text size="small"
                                            severity={rol.es_activo ? 'danger' : 'success'}
                                            tooltip={rol.es_activo ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={() => confirmarToggleEstado(rol)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Árbol de ventanas / permisos */}
            <div className="col-12 md:col-9">
                <div className="surface-card border-round p-3">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <p className="text-xs font-bold text-color-secondary uppercase m-0">Ventanas y permisos</p>

                        <Button
                            label="Guardar permisos"
                            icon="pi pi-check"
                            loading={guardando}
                            disabled={!idRolSeleccionado || !rolActivo}
                            onClick={guardar}
                        />
                    </div>

                    {!rolActivo && (
                        <Message
                            severity="warn"
                            text="Este rol está inactivo. Habilítalo para poder editar sus permisos."
                            className="w-full mb-3"
                        />
                    )}

                    {loading ? (
                        <div className="flex justify-content-center py-6">
                            <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
                        </div>
                    ) : (
                        <Tree
                            value={arbolMenu}
                            selectionMode="checkbox"
                            selectionKeys={selectedKeys}
                            onSelectionChange={(e) => setSelectedKeys(e.value as any)}
                            filter
                            filterMode="lenient"
                            filterPlaceholder="Buscar ventana..."
                            emptyMessage="No hay ventanas configuradas."
                            className={classNames('w-full border-none p-0', { 'opacity-60 pointer-events-none': !rolActivo })}
                        />
                    )}
                </div>
            </div>

            {/* Dialog crear/editar rol */}
            <Dialog
                header={rolForm.id_rol ? 'Editar rol' : 'Nuevo rol'}
                visible={rolDialogVisible}
                style={{ width: '400px' }}
                onHide={() => setRolDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setRolDialogVisible(false)} />
                        <Button label="Guardar" icon="pi pi-check" loading={guardandoRol} onClick={guardarRol} />
                    </div>
                }
            >
                <div className="flex flex-column gap-2 pt-2">
                    <label className="font-medium">
                        Nombre del rol <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        value={rolForm.nombre}
                        placeholder="Ej: Médico, Especialista SSO..."
                        onChange={(e) => setRolForm((prev) => ({ ...prev, nombre: e.target.value }))}
                        autoFocus
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default RolPermisosPanel;