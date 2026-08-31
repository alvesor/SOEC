// modules/empresa/components/EmpresaAtributosTab.tsx
'use client';

import { useRef } from 'react';
import { Button }                       from 'primereact/button';
import { Column }                       from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable }                    from 'primereact/datatable';
import { Dialog }                       from 'primereact/dialog';
import { Divider }                      from 'primereact/divider';
import { Dropdown }                     from 'primereact/dropdown';
import { InputNumber }                  from 'primereact/inputnumber';
import { InputSwitch }                  from 'primereact/inputswitch';
import { InputText }                    from 'primereact/inputtext';
import { ProgressSpinner }              from 'primereact/progressspinner';
import { SelectButton }                 from 'primereact/selectbutton';
import { Tag }                          from 'primereact/tag';
import { Toast }                        from 'primereact/toast';
import { useAtributo }                  from '@/modules/atributo/hooks/useAtributo';
import { ID_TIPO_LOV }                  from '@/modules/atributo/services/atributo.service';
import type { AtributoMedicoEmpresarial } from '@/modules/atributo/types/atributo.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CICLO_CONFIG: Record<string, { severity: any; icon: string }> = {
    'Permanente': { severity: 'info',    icon: 'pi pi-lock'    },
    'Temporal':   { severity: 'warning', icon: 'pi pi-clock'   },
    'Evento':     { severity: 'danger',  icon: 'pi pi-bolt'    },
    'Periódico':  { severity: 'success', icon: 'pi pi-refresh' },
};

const MODO_OPTIONS = [
    { label: 'Existente', value: false },
    { label: 'Nuevo',     value: true  },
];

// ── Componente ────────────────────────────────────────────────────────────────

const EmpresaAtributosTab = () => {

    const toast = useRef<any>(null);

    const {
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
        guardarLov,
    } = useAtributo(toast);

    const idsEnEmpresa        = new Set(atributosEmpresa.map(a => a.id_atributo));
    const atributosDisponibles = atributosGlobales.filter(
        a => !idsEnEmpresa.has(a.id_atributo) || a.id_atributo === formData.id_atributo
    );
    const esEdicion  = !!formData.id_atributo_medico_empresarial;
    const esTipoLov  = formData.id_tipo_dato === ID_TIPO_LOV;

    // ── Templates tabla ───────────────────────────────────────────────────────

    function templateNombre(row: AtributoMedicoEmpresarial) {
        return <span className="font-medium">{(row.atributo as any)?.nombre ?? '—'}</span>;
    }

    function templateCategoria(row: AtributoMedicoEmpresarial) {
        const nombre = (row.atributo as any)?.categoria?.nombre;
        return nombre ? <Tag value={nombre} /> : <span className="text-color-secondary">—</span>;
    }

    function templateTipoDato(row: AtributoMedicoEmpresarial) {
        const tipo = (row.atributo as any)?.tipo_dato?.nombre ?? '—';
        const lov  = (row.atributo as any)?.lov?.nombre;
        return (
            <span>
                {tipo}
                {lov && <small className="text-color-secondary ml-2">({lov})</small>}
            </span>
        );
    }

    function templateCiclo(row: AtributoMedicoEmpresarial) {
        const nombre = (row.atributo as any)?.tipo_ciclo?.nombre;
        if (!nombre) return <span className="text-color-secondary">—</span>;
        const cfg = CICLO_CONFIG[nombre];
        return <Tag value={nombre} severity={cfg?.severity ?? 'info'} icon={cfg?.icon} />;
    }

    function templateVigencia(row: AtributoMedicoEmpresarial) {
        return (row.atributo as any)?.requiere_vigencia
            ? <i className="pi pi-check-circle text-green-500" />
            : <i className="pi pi-minus-circle text-300" />;
    }

    function templateVisible(row: AtributoMedicoEmpresarial) {
        return <InputSwitch checked={row.es_visible}   onChange={e => toggleCampo(row.id_atributo_medico_empresarial, 'es_visible',   e.value)} />;
    }
    function templateRequerido(row: AtributoMedicoEmpresarial) {
        return <InputSwitch checked={row.es_requerido} onChange={e => toggleCampo(row.id_atributo_medico_empresarial, 'es_requerido', e.value)} />;
    }
    function templateEditable(row: AtributoMedicoEmpresarial) {
        return <InputSwitch checked={row.es_editable}  onChange={e => toggleCampo(row.id_atributo_medico_empresarial, 'es_editable',  e.value)} />;
    }

    function templateAcciones(row: AtributoMedicoEmpresarial) {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded text severity="info"   tooltip="Editar"            onClick={() => abrirEditar(row)} />
                <Button icon="pi pi-trash"  rounded text severity="danger" tooltip="Quitar de empresa" onClick={() =>
                    confirmDialog({
                        message:         `¿Quitar "${(row.atributo as any)?.nombre}" de esta empresa?`,
                        header:          'Confirmar eliminación',
                        icon:            'pi pi-exclamation-triangle',
                        acceptLabel:     'Sí, quitar',
                        rejectLabel:     'Cancelar',
                        acceptClassName: 'p-button-danger',
                        accept:          () => eliminar(row.id_atributo_medico_empresarial),
                    })
                } />
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Cabecera */}
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Atributos Empresariales</h5>
                    <span className="text-color-secondary">
                        Configura los campos médicos y de seguridad capturados en evaluaciones
                    </span>
                </div>
                <Button label="Agregar Atributo" icon="pi pi-plus" onClick={abrirNuevo} />
            </div>

            {/* Tabla */}
            {loading && !dialogVisible ? (
                <div className="flex justify-content-center py-6">
                    <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
                </div>
            ) : (
                <DataTable
                    value={atributosEmpresa}
                    paginator rows={10}
                    responsiveLayout="scroll"
                    emptyMessage="No hay atributos configurados para esta empresa."
                    sortField="orden" sortOrder={1}
                >
                    <Column field="orden"  header="#"         sortable style={{ width: '4rem' }} />
                    <Column header="Atributo"   body={templateNombre}    sortable />
                    <Column header="Categoría"  body={templateCategoria} />
                    <Column header="Tipo dato"  body={templateTipoDato}  />
                    <Column header="Ciclo"      body={templateCiclo}     />
                    <Column header="Vigencia"   body={templateVigencia}  style={{ width: '7rem', textAlign: 'center' }} />
                    <Column header="Visible"    body={templateVisible}   style={{ width: '7rem' }} />
                    <Column header="Requerido"  body={templateRequerido} style={{ width: '8rem' }} />
                    <Column header="Editable"   body={templateEditable}  style={{ width: '7rem' }} />
                    <Column header=""           body={templateAcciones}  style={{ width: '8rem' }} />
                </DataTable>
            )}

            {/* ── Dialog principal ── */}
            <Dialog
                header={esEdicion ? 'Editar atributo' : 'Agregar atributo'}
                visible={dialogVisible}
                style={{ width: '560px' }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setDialogVisible(false)} />
                        <Button label="Guardar"  icon="pi pi-check" loading={loading} onClick={guardar} />
                    </div>
                }
            >
                <div className="flex flex-column gap-4 pt-2">

                    {/* Sección 1: Atributo */}
                    <div>
                        <p className="text-xs font-bold text-color-secondary uppercase mb-3">Atributo</p>

                        {!esEdicion && (
                            <div className="mb-3">
                                <SelectButton
                                    value={formData.esNuevoAtributo}
                                    options={MODO_OPTIONS}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        esNuevoAtributo: e.value,
                                        id_atributo: null,
                                        nombre: '',
                                    }))}
                                />
                            </div>
                        )}

                        {!formData.esNuevoAtributo && (
                            <div className="flex flex-column gap-2">
                                <label className="font-medium">Seleccionar atributo <span className="text-red-500">*</span></label>
                                <Dropdown
                                    value={formData.id_atributo}
                                    options={atributosDisponibles}
                                    optionLabel="nombre"
                                    optionValue="id_atributo"
                                    placeholder="Buscar atributo..."
                                    filter showClear
                                    disabled={esEdicion}
                                    onChange={e => {
                                        const atr = atributosGlobales.find(a => a.id_atributo === e.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            id_atributo:       e.value,
                                            id_categoria:      atr?.id_categoria      ?? null,
                                            id_tipo_ciclo:     atr?.id_tipo_ciclo     ?? null,
                                            id_tipo_dato:      atr?.id_tipo_dato      ?? null,
                                            id_lov:            atr?.id_lov            ?? null,
                                            requiere_vigencia: atr?.requiere_vigencia ?? false,
                                        }));
                                    }}
                                />
                            </div>
                        )}

                        {formData.esNuevoAtributo && (
                            <div className="flex flex-column gap-2">
                                <label className="font-medium">Nombre <span className="text-red-500">*</span></label>
                                <InputText
                                    value={formData.nombre}
                                    placeholder="Ej: Es diabético, Peso (kg)..."
                                    onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>

                    <Divider className="my-0" />

                    {/* Sección 2: Clasificación */}
                    <div>
                        <p className="text-xs font-bold text-color-secondary uppercase mb-3">Clasificación</p>
                        <div className="grid">

                            {/* Tipo de dato */}
                            <div className="col-12 md:col-6 flex flex-column gap-2">
                                <label className="font-medium">Tipo de dato <span className="text-red-500">*</span></label>
                                <Dropdown
                                    value={formData.id_tipo_dato}
                                    options={tiposDato}
                                    optionLabel="nombre"
                                    optionValue="id_catalogo"
                                    placeholder="Boolean, Texto..."
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        id_tipo_dato: e.value,
                                        id_lov: e.value !== ID_TIPO_LOV ? null : prev.id_lov,
                                    }))}
                                />
                            </div>

                            {/* Categoría */}
                            <div className="col-12 md:col-6 flex flex-column gap-2">
                                <label className="font-medium">Categoría</label>
                                <Dropdown
                                    value={formData.id_categoria}
                                    options={categorias}
                                    optionLabel="nombre"
                                    optionValue="id_catalogo"
                                    placeholder="Médico, Seguridad..."
                                    showClear
                                    onChange={e => setFormData(prev => ({ ...prev, id_categoria: e.value }))}
                                />
                            </div>

                            {/* LOV — solo aparece si tipo dato = LOV */}
                            {esTipoLov && (
                                <div className="col-12 flex flex-column gap-2">
                                    <label className="font-medium">
                                        Lista de valores <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Dropdown
                                            value={formData.id_lov}
                                            options={catalogosLov}
                                            optionLabel="nombre"
                                            optionValue="id_catalogo"
                                            placeholder="Selecciona una lista..."
                                            filter showClear
                                            className="flex-1"
                                            onChange={e => setFormData(prev => ({ ...prev, id_lov: e.value }))}
                                        />
                                        <Button
                                            icon="pi pi-plus"
                                            label="Nueva lista"
                                            outlined
                                            onClick={abrirLovDialog}
                                            tooltip="Crear nueva lista de valores"
                                        />
                                    </div>
                                    {formData.id_lov && (
                                        <small className="text-color-secondary">
                                            <i className="pi pi-list mr-1" />
                                            Los valores de esta lista estarán disponibles al capturar evaluaciones.
                                        </small>
                                    )}
                                </div>
                            )}

                            {/* Ciclo de vida */}
                            <div className="col-12 md:col-6 flex flex-column gap-2">
                                <label className="font-medium">Ciclo de vida</label>
                                <Dropdown
                                    value={formData.id_tipo_ciclo}
                                    options={tiposCiclo}
                                    optionLabel="nombre"
                                    optionValue="id_catalogo"
                                    placeholder="Permanente, Temporal..."
                                    showClear
                                    onChange={e => setFormData(prev => ({ ...prev, id_tipo_ciclo: e.value }))}
                                />
                                {formData.id_tipo_ciclo && (
                                    <small className="text-color-secondary">
                                        {tiposCiclo.find(t => t.id_catalogo === formData.id_tipo_ciclo)?.nombre === 'Permanente' && 'No caduca — diabético, hipertenso'}
                                        {tiposCiclo.find(t => t.id_catalogo === formData.id_tipo_ciclo)?.nombre === 'Temporal'   && 'Tiene fecha de fin — embarazo, COVID'}
                                        {tiposCiclo.find(t => t.id_catalogo === formData.id_tipo_ciclo)?.nombre === 'Evento'     && 'Ocurre en un momento — amputación, accidente'}
                                        {tiposCiclo.find(t => t.id_catalogo === formData.id_tipo_ciclo)?.nombre === 'Periódico'  && 'Se mide en cada evaluación — peso, presión'}
                                    </small>
                                )}
                            </div>

                            {/* Requiere vigencia */}
                            <div className="col-12 md:col-6 flex align-items-center gap-3 pt-4">
                                <InputSwitch
                                    checked={formData.requiere_vigencia}
                                    onChange={e => setFormData(prev => ({ ...prev, requiere_vigencia: e.value }))}
                                />
                                <div>
                                    <div className="font-medium">Requiere vigencia</div>
                                    <small className="text-color-secondary">Se pedirá fecha de fin al registrar</small>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Divider className="my-0" />

                    {/* Sección 3: Configuración en la empresa */}
                    <div>
    <div className="grid">

        {/* Orden */}
        <div className="col-12 md:col-6 flex flex-column gap-2">
            <label className="font-medium">Orden</label>

            <InputNumber
                value={formData.orden}
                onValueChange={e =>
                    setFormData(prev => ({
                        ...prev,
                        orden: e.value ?? 0
                    }))
                }
                min={0}
                style={{ width: '80px' }}
            />
        </div>

        {/* Configuración de switches */}
        <div className="col-12 md:col-6 flex flex-column gap-3">

            {/* Visible */}
            <div className="flex align-items-center gap-3">
                <InputSwitch
                    checked={formData.es_visible}
                    onChange={e =>
                        setFormData(prev => ({
                            ...prev,
                            es_visible: e.value
                        }))
                    }
                />

                <div>
                    <div className="font-medium">
                        Visible
                    </div>
                    <small className="text-color-secondary">
                        Se muestra en el formulario
                    </small>
                </div>
            </div>

            {/* Requerido */}
            <div className="flex align-items-center gap-3">
                <InputSwitch
                    checked={formData.es_requerido}
                    onChange={e =>
                        setFormData(prev => ({
                            ...prev,
                            es_requerido: e.value
                        }))
                    }
                />

                <div>
                    <div className="font-medium">
                        Requerido
                    </div>
                    <small className="text-color-secondary">
                        Obligatorio al guardar
                    </small>
                </div>
            </div>

            {/* Editable */}
            <div className="flex align-items-center gap-3">
                <InputSwitch
                    checked={formData.es_editable}
                    onChange={e =>
                        setFormData(prev => ({
                            ...prev,
                            es_editable: e.value
                        }))
                    }
                />

                <div>
                    <div className="font-medium">
                        Editable
                    </div>
                    <small className="text-color-secondary">
                        El médico puede modificarlo
                    </small>
                </div>
            </div>

        </div>

    </div>
</div>

                </div>
            </Dialog>

            {/* ── Dialog Nueva Lista LOV ── */}
            <Dialog
                header="Nueva lista de valores"
                visible={lovDialogVisible}
                style={{ width: '440px' }}
                onHide={() => setLovDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text    onClick={() => setLovDialogVisible(false)} />
                        <Button label="Crear lista" icon="pi pi-check" loading={lovLoading} onClick={guardarLov} />
                    </div>
                }
            >
                <div className="flex flex-column gap-4 pt-2">

                    {/* Nombre de la lista */}
                    <div className="flex flex-column gap-2">
                        <label className="font-medium">Nombre de la lista <span className="text-red-500">*</span></label>
                        <InputText
                            value={lovForm.nombre}
                            placeholder="Ej: Grupo sanguíneo, Nivel de riesgo..."
                            onChange={e => setLovForm(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>

                    {/* Opciones */}
                    <div className="flex flex-column gap-2">
                        <div className="flex justify-content-between align-items-center">
                            <label className="font-medium">Opciones <span className="text-red-500">*</span></label>
                            <Button
                                label="Agregar opción"
                                icon="pi pi-plus"
                                text size="small"
                                onClick={agregarOpcionLov}
                            />
                        </div>
                        <div className="flex flex-column gap-2">
                            {lovForm.opciones.map((opcion, index) => (
                                <div key={index} className="flex gap-2 align-items-center">
                                    <InputText
                                        value={opcion}
                                        placeholder={`Opción ${index + 1}`}
                                        className="flex-1"
                                        onChange={e => actualizarOpcionLov(index, e.target.value)}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        rounded text
                                        severity="danger"
                                        disabled={lovForm.opciones.length === 1}
                                        onClick={() => eliminarOpcionLov(index)}
                                    />
                                </div>
                            ))}
                        </div>
                        <small className="text-color-secondary">
                            <i className="pi pi-info-circle mr-1" />
                            Al guardar la lista quedará disponible para seleccionar.
                        </small>
                    </div>

                </div>
            </Dialog>

        </div>
    );
};

export default EmpresaAtributosTab;
