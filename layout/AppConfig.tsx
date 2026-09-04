'use client';

import { PrimeReactContext } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react';
import { AppConfigProps, LayoutConfig, LayoutState } from '@/types';
import { LayoutContext } from './context/layoutcontext';

import { useSession } from 'next-auth/react';
import { Dropdown } from 'primereact/dropdown';
// import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';

const AppConfig = (props: AppConfigProps) => {
    
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const { setRipple, changeTheme } = useContext(PrimeReactContext);

    const onConfigButtonClick = () => {
        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: false }));
    };

    const router =
    useRouter();

const {
    data: session,
    update
} = useSession();

const empresas =
    session?.user?.empresas || [];

const empresaActual =
    session?.user?.empresa_activa || null;

const [empresaSeleccionada, setEmpresaSeleccionada] =
    useState(empresaActual);

    async function cambiarEmpresa() {

    if (!empresaSeleccionada) {
        return;
    }

    await update({

        id_empresa:
            empresaSeleccionada.id_empresa
    });

    /*
     * Refrescar ERP
     */

    router.refresh();
}

    

    const _changeTheme = (theme: string, colorScheme: string) => {
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
    };

    const decrementScale = () => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: prevState.scale - 1 }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: prevState.scale + 1 }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    useEffect(() => {
        applyScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.scale]);

    return (
        <>
            <button className="layout-config-button config-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>

            <Sidebar
    visible={layoutState.configSidebarVisible}
    onHide={onConfigSidebarHide}
    position="right"
    className="layout-config-sidebar w-25rem"
>
    <div className="flex flex-column h-full">

        {/* HEADER */}

        <div className="flex align-items-center justify-content-between mb-4">
            <div>
                <div className="text-2xl font-bold">
                    Mi Perfil
                </div>

                <div className="text-600">
                    Configuración personal del sistema
                </div>
            </div>

            <img
                src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                alt="perfil"
                className="border-circle"
                width="55"
            />
        </div>

        {/* PERFIL */}

        <div className="surface-100 border-round p-3 mb-4">

            <div className="font-semibold text-xl mb-1">
                Dr. Alexander Velásquez
            </div>

            <div className="text-600 mb-3">
                Administrador del Sistema
            </div>

            <div className="flex flex-column gap-2">

                <div className="flex align-items-center gap-2">
                    <i className="pi pi-building text-primary"></i>

                    <span>
                        Clínica Santa María
                    </span>
                </div>

                <div className="flex align-items-center gap-2">
                    <i className="pi pi-id-card text-primary"></i>

                    <span>
                        1310113202
                    </span>
                </div>

                <div className="flex align-items-center gap-2">
                    <i className="pi pi-clock text-primary"></i>

                    <span>
                        Último acceso:
                        17/05/2026 09:42
                    </span>
                </div>
            </div>
        </div>

        {/* EMPRESA */}
<div className="mb-5">

    <div className="text-900 font-semibold text-xl mb-3">

        Empresa Activa

    </div>

    <div className="text-600 mb-4">

        Selecciona la empresa con la que deseas trabajar.

    </div>

    <Dropdown
        value={empresaSeleccionada}
        options={empresas}
        optionLabel="razon_social"
        placeholder="Seleccionar empresa"
        className="w-full mb-3"
        onChange={(e) =>
            setEmpresaSeleccionada(
                e.value
            )
        }
    />

    <Button
        label="Cambiar Empresa"
        icon="pi pi-building"
        className="w-full"
        onClick={cambiarEmpresa}
    />

</div>

        {/* <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Empresa Activa
            </div>

            <select className="p-inputtext p-component w-full mb-3">

                <option>
                    Clínica Santa María
                </option>

                <option>
                    Hospital San José
                </option>

                <option>
                    Laboratorio Diagnóstico Sur
                </option>

            </select>

            <Button
                label="Cambiar Empresa"
                icon="pi pi-building"
                className="w-full"
            />
        </div> */}

        {/* TEMA */}

        <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Apariencia
            </div>

            <div className="flex flex-column gap-3">

                <div className="flex align-items-center justify-content-between surface-100 border-round p-3">

                    <div className="flex align-items-center gap-3">
                        <i className="pi pi-sun text-yellow-500 text-xl"></i>

                        <span>
                            Tema Claro
                        </span>
                    </div>

                    <RadioButton
                        inputId="light"
                        name="theme"
                        value="light"
                        checked={layoutConfig.colorScheme === 'light'}
                        onChange={() => _changeTheme('lara-light-indigo', 'light')}
                    />
                </div>

                <div className="flex align-items-center justify-content-between surface-100 border-round p-3">

                    <div className="flex align-items-center gap-3">
                        <i className="pi pi-moon text-blue-500 text-xl"></i>

                        <span>
                            Tema Oscuro
                        </span>
                    </div>

                    <RadioButton
                        inputId="dark"
                        name="theme"
                        value="dark"
                        checked={layoutConfig.colorScheme === 'dark'}
                        onChange={() => _changeTheme('lara-dark-indigo', 'dark')}
                    />
                </div>
            </div>
        </div>

        {/* FAVORITOS */}

        <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Accesos Rápidos
            </div>

            <div className="flex flex-wrap gap-2">

                <Button
                    label="Pacientes"
                    icon="pi pi-users"
                    outlined
                    size="small"
                />

                <Button
                    label="Facturación"
                    icon="pi pi-money-bill"
                    outlined
                    size="small"
                />

                <Button
                    label="Inventario"
                    icon="pi pi-box"
                    outlined
                    size="small"
                />

                <Button
                    label="Empresas"
                    icon="pi pi-building"
                    outlined
                    size="small"
                />
            </div>
        </div>

        {/* MODULOS RECIENTES */}

        <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Últimos Módulos
            </div>

            <div className="flex flex-column gap-2">

                <div className="surface-100 border-round p-3">
                    <div className="font-semibold">
                        Facturación
                    </div>

                    <div className="text-600 text-sm">
                        Hace 5 minutos
                    </div>
                </div>

                <div className="surface-100 border-round p-3">
                    <div className="font-semibold">
                        Inventario
                    </div>

                    <div className="text-600 text-sm">
                        Hace 12 minutos
                    </div>
                </div>

                <div className="surface-100 border-round p-3">
                    <div className="font-semibold">
                        Pacientes
                    </div>

                    <div className="text-600 text-sm">
                        Hace 30 minutos
                    </div>
                </div>
            </div>
        </div>

        {/* SEGURIDAD */}

        <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Seguridad
            </div>

            <div className="flex flex-column gap-3">

                <Button
                    label="Cambiar Contraseña"
                    icon="pi pi-lock"
                    severity="secondary"
                    outlined
                    className="w-full"
                />

                <Button
                    label="Sesiones Activas"
                    icon="pi pi-desktop"
                    severity="secondary"
                    outlined
                    className="w-full"
                />

                <Button
                    label="Autenticación 2FA"
                    icon="pi pi-shield"
                    severity="secondary"
                    outlined
                    className="w-full"
                />
            </div>
        </div>

        {/* NOTIFICACIONES */}

        <div className="mb-4">

            <div className="text-xl font-semibold mb-3">
                Notificaciones
            </div>

            <div className="flex flex-column gap-3">

                <div className="flex align-items-center justify-content-between surface-100 border-round p-3">

                    <span>
                        Correo electrónico
                    </span>

                    <InputSwitch checked />
                </div>

                <div className="flex align-items-center justify-content-between surface-100 border-round p-3">

                    <span>
                        Notificaciones del sistema
                    </span>

                    <InputSwitch checked />
                </div>

                <div className="flex align-items-center justify-content-between surface-100 border-round p-3">

                    <span>
                        WhatsApp
                    </span>

                    <InputSwitch />
                </div>
            </div>
        </div>

        {/* FOOTER */}

        <div className="mt-auto pt-4">

            <Button
                label="Cerrar Sesión"
                icon="pi pi-sign-out"
                severity="danger"
                className="w-full"
            />
        </div>
    </div>
</Sidebar>
        </>
    );
};

export default AppConfig;
