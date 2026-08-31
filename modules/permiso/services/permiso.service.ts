export function tienePermiso(pathname: string, permisos: string[]) {
    /*
     * Dashboard principal
     */

    if (pathname === '/dashboard') {
        return true;
    }

    /*
     * Validar permisos
     */

    return permisos.some((permiso) => pathname.startsWith(permiso));
}
