'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Layout from '../../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {

    // const { status } = useSession();

    // const router = useRouter();

    // useEffect(() => {

    //     if (status === 'unauthenticated') {
    //         router.push('/');
    //     }

    // }, [status]);

    // if (status === 'loading') {
    //     return null;
    // }

    // if (status === 'unauthenticated') {
    //     return null;
    // }

    return <Layout>{children}</Layout>;
}