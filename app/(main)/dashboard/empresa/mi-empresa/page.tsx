'use client';

import React from 'react';

import {
    TabView,
    TabPanel
}
from 'primereact/tabview';

import EmpresaInformacionTab
from '@/modules/empresa/components/EmpresaInformacionTab';

import EmpresaAtributosTab
from '@/modules/empresa/components/EmpresaAtributosTab';

import EmpresaParametrosTab
from '@/modules/empresa/components/EmpresaParametrosTab';

import EmpresaIdentidadTab
from '@/modules/empresa/components/EmpresaIdentidadTab';

const MiEmpresaPage = () => {

    return (

        <div className="grid">

            <div className="col-12">

                <div className="card">

                    <div className="flex align-items-center justify-content-between mb-4">

                        <div>

                            <h3 className="mb-1">
                                Mi Empresa
                            </h3>

                            <span className="text-color-secondary">

                                Administración institucional
                                y configuración empresarial

                            </span>

                        </div>

                    </div>

                    <TabView>

                        <TabPanel
                            header="Información"
                        >

                            <EmpresaInformacionTab />

                        </TabPanel>

                        <TabPanel
                            header="Atributos"
                        >

                            <EmpresaAtributosTab />

                        </TabPanel>

                        <TabPanel
                            header="Parámetros"
                        >

                            <EmpresaParametrosTab />

                        </TabPanel>

                        <TabPanel
                            header="Identidad"
                        >

                            <EmpresaIdentidadTab />

                        </TabPanel>

                    </TabView>

                </div>

            </div>

        </div>
    );
};

export default MiEmpresaPage;