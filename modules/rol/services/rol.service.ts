// modules/rol/services/rol.service.ts
import { obtenerRoles, crearRol, actualizarRol, obtenerMenusParaArbol, obtenerPermisosDeRol, reemplazarPermisosDeRol } from '../repositories/rol.repository';
import type { MenuTreeNode, Rol, SelectedKeysMap } from '../types/rol.types';

// ── Roles (CRUD) ──────────────────────────────────────────────────────────────

export async function cargarRoles(): Promise<Rol[]> {
    const { data, error } = await obtenerRoles();
    if (error) throw error;
    return (data ?? []) as Rol[];
}

export async function crearNuevoRol(nombre: string) {
    const { data, error } = await crearRol(nombre.trim());
    if (error) throw error;
    return data as Rol;
}

export async function actualizarNombreRol(id_rol: number, nombre: string) {
    const { error } = await actualizarRol(id_rol, { nombre: nombre.trim() });
    if (error) throw error;
}

export async function cambiarEstadoRol(id_rol: number, es_activo: boolean) {
    const { error } = await actualizarRol(id_rol, { es_activo });
    if (error) throw error;
}

// ── Árbol de menú y permisos ────────────────────────────────────────────────

export async function cargarArbolMenu(): Promise<MenuTreeNode[]> {
    const { data, error } = await obtenerMenusParaArbol();
    if (error) throw error;
    return construirArbol(data ?? [], -1);
}

function construirArbol(menus: any[], idPadre: number): MenuTreeNode[] {
    return menus
        .filter((m) => m.id_padre === idPadre)
        .map((m) => {
            const hijos = construirArbol(menus, m.id_menu);

            return {
                key: String(m.id_menu),
                label: m.nombre,
                icon: m.icono,
                data: { id_menu: m.id_menu, url: m.url },
                children: hijos.length > 0 ? hijos : undefined
            };
        });
}

export async function cargarEstadoPermisosRol(id_rol: number, arbolMenu: MenuTreeNode[]): Promise<SelectedKeysMap> {
    const { data, error } = await obtenerPermisosDeRol(id_rol);
    if (error) throw error;

    const idsPermitidos = new Set((data ?? []).map((p: any) => p.id_menu));
    const resultado: SelectedKeysMap = {};

    function calcular(nodo: MenuTreeNode): boolean {
        const hijos = nodo.children ?? [];

        if (hijos.length === 0) {
            const checked = idsPermitidos.has(nodo.data!.id_menu);
            resultado[nodo.key] = { checked, partialChecked: false };
            return checked;
        }

        let todos = true;
        let alguno = false;

        for (const hijo of hijos) {
            const hijoChecked = calcular(hijo);
            const hijoEstado = resultado[hijo.key];

            if (!hijoChecked) todos = false;
            if (hijoChecked || hijoEstado.partialChecked) alguno = true;
        }

        const checked = todos;
        const partial = !todos && alguno;

        resultado[nodo.key] = { checked, partialChecked: partial };
        return checked;
    }

    arbolMenu.forEach(calcular);

    return resultado;
}

export async function guardarPermisosRol(id_rol: number, selectedKeys: SelectedKeysMap) {
    const ids_menu = Object.entries(selectedKeys)
        .filter(([, estado]) => estado?.checked)
        .map(([key]) => Number(key));

    const { error } = await reemplazarPermisosDeRol(id_rol, ids_menu);
    if (error) throw error;
}
