import { withAuth } from 'next-auth/middleware';

import { NextResponse } from 'next/server';

import { tienePermiso } from '@/modules/permiso/services/permiso.service';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        const pathname = req.nextUrl.pathname;

        /*
         * Permitir acceso
         * acceso-denegado
         */

        if (pathname === '/dashboard/acceso-denegado') {
            return NextResponse.next();
        }

        /*
         * Obtener permisos JWT
         */

        const permisos = (token?.permisos as string[]) || [];

        /*
         * Validar permisos
         */

        const permitido = tienePermiso(pathname, permisos);

        /*
         * Bloquear acceso
         */

        if (!permitido) {
            return NextResponse.redirect(new URL('/dashboard/acceso-denegado', req.url));
        }

        return NextResponse.next();
    },

    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
);

export const config = {
    matcher: ['/dashboard/:path*']
};
