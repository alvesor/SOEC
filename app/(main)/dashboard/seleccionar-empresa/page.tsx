'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from 'primereact/button';

const SeleccionarEmpresaPage = () => {

    const router = useRouter();

    const { data: session, update } = useSession();

    const empresas = session?.user?.empresas || [];

    const [idEmpresaCargando, setIdEmpresaCargando] = useState<number | null>(null);

    async function seleccionar(id_empresa: number) {

        setIdEmpresaCargando(id_empresa);

        await update({
            id_empresa
        });

        router.replace('/dashboard');

        router.refresh();
    }

    return (

        <div className="flex align-items-center justify-content-center min-h-screen">

            <div className="surface-card p-6 shadow-4 border-round-2xl w-full lg:w-5">

                <div className="text-center mb-5">

                    <i className="pi pi-building text-primary" style={{ fontSize: '3rem' }} />

                    <div className="text-900 text-3xl font-bold mt-3 mb-2">
                        Selecciona una empresa
                    </div>

                    <div className="text-600">
                        Tu usuario tiene acceso a varias empresas.
                        Elige con cuál deseas trabajar.
                    </div>

                </div>

                <div className="flex flex-column gap-3">

                    {empresas.map((empresa: any) => (

                        <Button
                            key={empresa.id_empresa}
                            label={empresa.razon_social}
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            severity="secondary"
                            outlined
                            loading={idEmpresaCargando === empresa.id_empresa}
                            disabled={idEmpresaCargando !== null}
                            className="w-full justify-content-between"
                            onClick={() => seleccionar(empresa.id_empresa)}
                        />
                    ))}

                </div>

            </div>

        </div>
    );
};

export default SeleccionarEmpresaPage;