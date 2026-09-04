import { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import { loginUsuario, cambiarEmpresaActiva } from '@/modules/auth/services/auth.service';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',

            credentials: {
                identificacion: {
                    label: 'Usuario',
                    type: 'text'
                },

                password: {
                    label: 'Password',
                    type: 'password'
                }
            },

            async authorize(credentials) {
                return await loginUsuario(credentials?.identificacion || '', credentials?.password || '');
            }
        })
    ],

    pages: {
        signIn: '/landing'
    },

    session: {
        strategy: 'jwt'
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id_usuario = user.id_usuario;

                token.name = user.name;

                token.permisos = user.permisos;

                token.empresas = user.empresas;

                token.empresa_activa = user.empresa_activa;
            }

            /*
             * Cambio de empresa activa: se valida y se
             * recalculan permisos en el servidor, nunca
             * se confía en lo que manda el cliente.
             */

            if (trigger === 'update' && session?.id_empresa) {
                const resultado = await cambiarEmpresaActiva(token.id_usuario as number, session.id_empresa);

                if (resultado) {
                    token.empresa_activa = resultado.empresa_activa;

                    token.permisos = resultado.permisos;
                }
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id_usuario = token.id_usuario as any;

            session.user.name = token.name as any;

            session.user.permisos = token.permisos as any;

            session.user.empresas = token.empresas as any;

            session.user.empresa_activa = token.empresa_activa as any;

            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET
};
