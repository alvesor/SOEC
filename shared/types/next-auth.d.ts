import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id_usuario: number;

            permisos: string[];

            empresas: any[];

            empresa_activa: any;
        } & DefaultSession['user'];
    }

    interface User {
        id_usuario: number;

        permisos: string[];

        empresas: any[];

        empresa_activa: any;
    }
}
