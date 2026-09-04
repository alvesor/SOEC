// modules/personal/components/PersonalFormDialog.tsx
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import type { CatalogoItem, PersonalForm } from '../types/personal.types';

interface Props {
    visible: boolean;
    loading: boolean;
    formData: PersonalForm;
    setFormData: React.Dispatch<React.SetStateAction<PersonalForm>>;
    tiposIdentificacion: CatalogoItem[];
    onHide: () => void;
    onGuardar: () => void;
}

const PersonalFormDialog = ({ visible, loading, formData, setFormData, tiposIdentificacion, onHide, onGuardar }: Props) => {
    const esEdicion = !!formData.id_persona;

    return (
        <Dialog
            header={esEdicion ? 'Editar Personal' : 'Nuevo Personal'}
            visible={visible}
            style={{ width: '480px' }}
            onHide={onHide}
            footer={
                <div className="flex justify-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" text onClick={onHide} />
                    <Button label="Guardar" icon="pi pi-check" loading={loading} onClick={onGuardar} />
                </div>
            }
        >
            <div className="flex flex-column gap-4 pt-2">
                <div className="flex flex-column gap-2">
                    <label className="font-medium">
                        Tipo de identificación <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.id_tipo_identificacion}
                        options={tiposIdentificacion}
                        optionLabel="nombre"
                        optionValue="id_catalogo"
                        placeholder="Selecciona..."
                        onChange={(e) => setFormData((prev) => ({ ...prev, id_tipo_identificacion: e.value }))}
                    />
                </div>

                <div className="flex flex-column gap-2">
                    <label className="font-medium">
                        Identificación <span className="text-red-500">*</span>
                    </label>
                    <InputText value={formData.identificacion} disabled={esEdicion} onChange={(e) => setFormData((prev) => ({ ...prev, identificacion: e.target.value }))} />
                </div>

                <div className="flex flex-column gap-2">
                    <label className="font-medium">
                        Nombres <span className="text-red-500">*</span>
                    </label>
                    <InputText value={formData.nombres} onChange={(e) => setFormData((prev) => ({ ...prev, nombres: e.target.value }))} />
                </div>

                <div className="flex flex-column gap-2">
                    <label className="font-medium">
                        Apellidos <span className="text-red-500">*</span>
                    </label>
                    <InputText value={formData.apellidos} onChange={(e) => setFormData((prev) => ({ ...prev, apellidos: e.target.value }))} />
                </div>

                {!esEdicion && (
                    <div className="flex align-items-center gap-3">
                        <InputSwitch checked={formData.requiere_acceso} onChange={(e) => setFormData((prev) => ({ ...prev, requiere_acceso: e.value }))} />
                        <div>
                            <div className="font-medium">Requiere acceso al sistema</div>
                            <small className="text-color-secondary">Clave inicial = número de identificación</small>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default PersonalFormDialog;