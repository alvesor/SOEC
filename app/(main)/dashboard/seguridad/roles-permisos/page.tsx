// app/(main)/dashboard/seguridad/roles-permisos/page.tsx
'use client';

import RolPermisosPanel from '@/modules/rol/components/RolPermisosPanel';

const RolesPermisosPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="mb-4">
                        <h3 className="mb-1">Roles y Permisos</h3>
                        <span className="text-color-secondary">Define qué ventanas puede ver cada rol dentro del sistema</span>
                    </div>

                    <RolPermisosPanel />
                </div>
            </div>
        </div>
    );
};

export default RolesPermisosPage;