import { Menu } from '../types/menu.types';

export function construirMenuVisible(menus: Menu[], permisos: string[]) {
    /*
     * Validar visible
     */

    function esVisible(menu: Menu): boolean {
        /*
         * Hijos
         */

        const hijos = menus.filter((m) => m.id_padre === menu.id_menu);

        /*
         * Si tiene hijos
         */

        if (hijos.length > 0) {
            /*
             * Visible si
             * algún hijo visible
             */

            return hijos.some((hijo) => esVisible(hijo));
        }

        /*
         * Menú hoja
         */

        return menu.es_publico || permisos.includes(menu.url || '');
    }

    /*
     * Filtrar visibles
     */

    return menus.filter((menu) => esVisible(menu));
}
