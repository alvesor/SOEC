'use client';

import EmpresaListado from '@/modules/empresa/components/EmpresaListado';

export default function Page() {
    return (
        <div className="grid">
            <div className="col-12">
                <EmpresaListado />
            </div>
        </div>
    );
}