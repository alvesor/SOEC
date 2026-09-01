'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { cargarEmpresa, guardarEmpresa } from '../services/empresa.service';

export function useEmpresa() {
    const { data: session } = useSession();

    const [empresa, setEmpresa] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.empresa_activa) {
            obtenerEmpresa();
        }
    }, [session]);

    async function obtenerEmpresa() {
        try {
            setLoading(true);

            const id_empresa = session?.user?.empresa_activa?.id_empresa;

            const data = await cargarEmpresa(id_empresa);

            setEmpresa(data);
        } finally {
            setLoading(false);
        }
    }

    async function actualizar(values: any) {
        const id_empresa = session?.user?.empresa_activa?.id_empresa;

        await guardarEmpresa(id_empresa, values);

        await obtenerEmpresa();
    }

    return {
        empresa,

        loading,

        actualizar
    };
}
