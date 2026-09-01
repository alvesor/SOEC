'use client';

import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { ROLES } from '../constants';

const MODO_OPTIONS = [
    { label: 'Buscar existente', value: 'buscar' },
    { label: 'Crear nuevo', value: 'nuevo' }
];

interface Props {
    hook: ReturnType<typeof import('../hooks/useAdministrarEmpresas').useAdministrarEmpresas>;
}

const ResponsableDialog = ({ hook }: Props) => {
    const {
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
        confirmarResponsable
    } = hook;

    function toggleRol(id_rol: number) {
        setRolesSeleccionados((prev: number[]) => (prev.includes(id_rol) ? prev.filter((r) => r !== id_rol) : [...prev, id_rol]));
    }

    return (
        <Dialog
            header="Agregar responsable"
            visible={responsableDialogVisible}
            style={{ width: '480px' }}
            onHide={() => setResponsableDialogVisible(false)}
            footer={
                <div className="flex justify-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" text onClick={() => setResponsableDialogVisible(false)} />
                    <Button label="Agregar" icon="pi pi-check" onClick={confirmarResponsable} />
                </div>
            }
        >
            <div className="flex flex-column gap-4 pt-2">
                <SelectButton value={modoResponsable} options={MODO_OPTIONS} onChange={(e) => setModoResponsable(e.value)} />

                {modoResponsable === 'buscar' ? (
                    <div className="flex flex-column gap-2">
                        <label className="font-medium">Buscar por cédula o nombre</label>
                        <AutoComplete
                            value={usuarioSeleccionado ? `${usuarioSeleccionado.nombres} ${usuarioSeleccionado.apellidos}` : busquedaTexto}
                            suggestions={resultadosBusqueda}
                            field="nombres"
                            itemTemplate={(item) => (
                                <div>
                                    <div className="font-medium">
                                        {item.nombres} {item.apellidos}
                                    </div>
                                    <small className="text-color-secondary">{item.identificacion}</small>
                                </div>
                            )}
                            completeMethod={(e) => buscarResponsable(e.query)}
                            onChange={(e) => {
                                if (typeof e.value === 'string') buscarResponsable(e.value);
                            }}
                            onSelect={(e) => setUsuarioSeleccionado(e.value)}
                            placeholder="Ej: Juan Pérez, 1310113202..."
                            className="w-full"
                            inputClassName="w-full"
                            loading={buscando}
                        />
                    </div>
                ) : (
                    <div className="flex flex-column gap-3">
                        <div className="flex flex-column gap-2">
                            <label className="font-medium">Tipo de identificación</label>
                            <Dropdown
                                value={nuevoUsuarioForm.id_tipo_identificacion || null}
                                options={tiposIdentificacion}
                                optionLabel="nombre"
                                optionValue="id_catalogo"
                                placeholder="Cédula, RUC, Pasaporte..."
                                onChange={(e) => setNuevoUsuarioForm((prev) => ({ ...prev, id_tipo_identificacion: e.value }))}
                            />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label className="font-medium">Identificación</label>
                            <InputText value={nuevoUsuarioForm.identificacion} onChange={(e) => setNuevoUsuarioForm((prev) => ({ ...prev, identificacion: e.target.value }))} />
                        </div>

                        <div className="grid">
                            <div className="col-6 flex flex-column gap-2">
                                <label className="font-medium">Nombres</label>
                                <InputText value={nuevoUsuarioForm.nombres} onChange={(e) => setNuevoUsuarioForm((prev) => ({ ...prev, nombres: e.target.value }))} />
                            </div>
                            <div className="col-6 flex flex-column gap-2">
                                <label className="font-medium">Apellidos</label>
                                <InputText value={nuevoUsuarioForm.apellidos} onChange={(e) => setNuevoUsuarioForm((prev) => ({ ...prev, apellidos: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex flex-column gap-2">
                            <label className="font-medium">Clave de acceso</label>
                            <Password value={nuevoUsuarioForm.clave} onChange={(e) => setNuevoUsuarioForm((prev) => ({ ...prev, clave: e.target.value }))} toggleMask feedback={false} className="w-full" inputClassName="w-full" />
                        </div>
                    </div>
                )}

                <div className="flex flex-column gap-2">
                    <label className="font-medium">Rol en esta empresa</label>
                    <div className="flex gap-4">
                        <div className="flex align-items-center gap-2">
                            <Checkbox checked={rolesSeleccionados.includes(ROLES.MEDICO)} onChange={() => toggleRol(ROLES.MEDICO)} />
                            <span>Médico</span>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Checkbox checked={rolesSeleccionados.includes(ROLES.SSO)} onChange={() => toggleRol(ROLES.SSO)} />
                            <span>Especialista SSO</span>
                        </div>
                    </div>
                    <small className="text-color-secondary">Puedes marcar ambos si la persona cumple los dos roles.</small>
                </div>
            </div>
        </Dialog>
    );
};

export default ResponsableDialog;