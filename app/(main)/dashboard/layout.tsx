'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Layout from '../../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

const RUTA_SELECCIONAR_EMPRESA = '/dashboard/seleccionar-empresa';

export default function AppLayout({ children }: AppLayoutProps) {

    const { data: session, status } = useSession();

    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {

        if (status !== 'authenticated') {
            return;
        }

        const empresas = session?.user?.empresas || [];

        const empresa_activa = session?.user?.empresa_activa;

        /*
         * Usuario con más de una empresa y sin
         * empresa activa aún -> obligarlo a elegir
         */

        if (empresas.length > 1 && !empresa_activa && pathname !== RUTA_SELECCIONAR_EMPRESA) {
            router.replace(RUTA_SELECCIONAR_EMPRESA);
        }

    }, [status, session, pathname]);

    return <Layout>{children}</Layout>;
}