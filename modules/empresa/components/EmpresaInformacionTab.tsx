'use client';

import React,
{
    useEffect,
    useState
}
from 'react';

import {
    InputText
}
from 'primereact/inputtext';

import {
    InputTextarea
}
from 'primereact/inputtextarea';

import {
    Button
}
from 'primereact/button';

import {
    useEmpresa
}
from '../hooks/useEmpresa';

const EmpresaInformacionTab = () => {

    const {
        empresa,
        actualizar
    } =
        useEmpresa();

    const [form, setForm] =
        useState<any>({
            razon_social: '',
            ruc: '',
            descripcion: '',
            correo: '',
            telefono: ''
        });

    useEffect(() => {

        if (empresa) {

            setForm(empresa);
        }

    }, [empresa]);

    async function
    guardar() {

        await actualizar(form);
    }

    return (

        <div className="grid">

            <div className="col-12 md:col-6">

                <label className="block mb-2">
                    Razón Social
                </label>

                <InputText

                    value={
                        form.razon_social || ''
                    }

                    onChange={(e) =>
                        setForm({
                            ...form,
                            razon_social:
                                e.target.value
                        })
                    }

                    className="w-full"
                />

            </div>

            <div className="col-12 md:col-6">

                <label className="block mb-2">
                    RUC
                </label>

                <InputText

                    value={
                        form.ruc || ''
                    }

                    onChange={(e) =>
                        setForm({
                            ...form,
                            ruc:
                                e.target.value
                        })
                    }

                    className="w-full"
                />

            </div>

            <div className="col-12">

                <label className="block mb-2">
                    Descripción
                </label>

                <InputTextarea

                    rows={5}

                    value={
                        form.descripcion || ''
                    }

                    onChange={(e) =>
                        setForm({
                            ...form,
                            descripcion:
                                e.target.value
                        })
                    }

                    className="w-full"
                />

            </div>

            <div className="col-12 md:col-6">

                <label className="block mb-2">
                    Correo
                </label>

                <InputText

                    value={
                        form.correo || ''
                    }

                    onChange={(e) =>
                        setForm({
                            ...form,
                            correo:
                                e.target.value
                        })
                    }

                    className="w-full"
                />

            </div>

            <div className="col-12 md:col-6">

                <label className="block mb-2">
                    Teléfono
                </label>

                <InputText

                    value={
                        form.telefono || ''
                    }

                    onChange={(e) =>
                        setForm({
                            ...form,
                            telefono:
                                e.target.value
                        })
                    }

                    className="w-full"
                />

            </div>

            <div className="col-12">

                <Button

                    label="Guardar"

                    icon="pi pi-save"

                    onClick={guardar}
                />

            </div>

        </div>
    );
};

export default EmpresaInformacionTab;