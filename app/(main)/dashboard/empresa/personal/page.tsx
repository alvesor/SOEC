// app/(main)/dashboard/empresa/personal/page.tsx
'use client';

import PersonalListado from '@/modules/personal/components/PersonalListado';

const PersonalPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <PersonalListado />
                </div>
            </div>
        </div>
    );
};

export default PersonalPage;