'use client';
import { useEffect } from 'react';
import { cargarEmpresa, guardarEmpresa } from '@/modules/empresa/services/empresa.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { subirImagenEmpresa } from '@/modules/documento/services/documento.service';
// import { guardarEmpresa } from '@/modules/empresa/services/empresa.service';
import { useSession } from 'next-auth/react';
import DocumentoUpload from '@/modules/documento/components/DocumentoUpload';

const EmpresaIdentidadTab = () => {

    const { data: session } = useSession();
    const toast = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

useEffect(() => {
    const id_empresa = session?.user?.empresa_activa?.id_empresa;
    if (!id_empresa) return;

    cargarEmpresa(id_empresa).then((empresa) => {
        if (empresa?.logo) setLogoUrl(empresa.logo);
    });
}, [session]);

    async function onUpload(files: File[]) {

        const file = files[0];
        if (!file) return;

        const id_empresa = session?.user?.empresa_activa?.id_empresa;

        setLoading(true);

        try {

            const url = await subirImagenEmpresa(id_empresa, file);

            await guardarEmpresa(id_empresa, { logo: url });

            setLogoUrl(url);

            toast.current?.show({
                severity: 'success',
                summary: 'Logo actualizado',
                detail: 'El logo se guardó correctamente.',
                life: 3000,
            });

        } catch (error) {

            console.error(error);

            toast.current?.show({
                severity: 'error',
                summary: 'Error al subir',
                detail: 'No se pudo guardar el logo. Intente nuevamente.',
                life: 4000,
            });

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="grid">

            <Toast ref={toast} />

            <div className="col-12">

                <div className="border-1 border-round p-5 text-center">

                    {logoUrl ? (

                        <img
                            src={logoUrl}
                            alt="Logo empresarial"
                            style={{
                                maxHeight: '120px',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                marginBottom: '1rem',
                                borderRadius: '8px',
                            }}
                        />

                    ) : (

                        <i className="pi pi-image text-5xl mb-3" />

                    )}

                    <h5>Logo Empresarial</h5>

                    <p>Configure la identidad visual institucional</p>

                    <div className="mt-4">

                        {loading ? (

                            <div className="flex flex-column align-items-center gap-2">
                                <ProgressSpinner
                                    style={{ width: '40px', height: '40px' }}
                                    strokeWidth="4"
                                />
                                <span className="text-sm text-color-secondary">
                                    Subiendo logo...
                                </span>
                            </div>

                        ) : (

                            <DocumentoUpload
                                multiple={false}
                                accept="image/*"
                                maxFileSize={1000000}
                                chooseLabel={logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                                onUpload={onUpload}
                            />

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EmpresaIdentidadTab;
