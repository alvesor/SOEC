'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { obtenerMenusActivos } from '../repositories/menu.repository';

import { construirMenuVisible } from '../services/menu.service';

export function useMenu() {
    const { data: session, status } = useSession();

    const [menus, setMenus] = useState<any[]>([]);

    useEffect(() => {
        if (status === 'authenticated') {
            cargarMenus();
        }
    }, [status]);

    async function cargarMenus() {
        const { data } = await obtenerMenusActivos();

        const permisos = session?.user?.permisos || [];

        const visibles = construirMenuVisible(data || [], permisos);

        /*
         * Construir árbol
         */

        const arbol = construirArbol(visibles);

        setMenus(arbol);
    }

    return menus;
}

/*
 * Árbol menú
 */

function construirArbol(menus: any[], idPadre = -1) {
    return menus
        .filter((m) => m.id_padre === idPadre)
        .map((menu) => {
            const hijos = construirArbol(menus, menu.id_menu);

            return {
                label: menu.nombre,

                icon: menu.icono,

                to: menu.url,

                items: hijos.length > 0 ? hijos : undefined
            };
        });
}
