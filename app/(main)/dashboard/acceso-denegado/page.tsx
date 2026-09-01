import Link from 'next/link';

export default function AccesoDenegadoPage() {

    return (

        <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">

            <div className="surface-card p-6 shadow-4 border-round-2xl w-full lg:w-5">

                <div className="text-center mb-5">

                    <div
    className="
        flex
        align-items-center
        justify-content-center
        overflow-auto
    "
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'var(--surface-ground)'
    }}
>

                        <i
                            className="pi pi-lock text-red-500"
                            style={{
                                fontSize: '3rem'
                            }}
                        />

                    </div>

                    <div className="text-900 text-4xl font-bold mb-3">

                        Acceso Denegado

                    </div>

                    <div className="text-600 text-xl line-height-3">

                        No tienes permisos suficientes para acceder
                        a este módulo del sistema.

                    </div>

                </div>

                <div className="surface-100 border-round p-4 mb-5">

                    <div className="flex align-items-start gap-3">

                        <i
                            className="pi pi-info-circle text-primary mt-1"
                            style={{
                                fontSize: '1.3rem'
                            }}
                        />

                        <div>

                            <div className="text-900 font-semibold mb-2">

                                ¿Por qué ocurre esto?

                            </div>

                            <div className="text-700 line-height-3">

                                Tu usuario ha iniciado sesión correctamente,
                                pero actualmente no posee permisos asignados
                                para visualizar esta opción.

                            </div>

                        </div>

                    </div>

                </div>

                <div className="grid">

                    <div className="col-12 md:col-6">

                        <Link href="/dashboard">

                            <button
                                className="
                                    p-button
                                    p-component
                                    w-full
                                "
                            >

                                <i className="pi pi-home mr-2" />

                                <span>
                                    Ir al Dashboard
                                </span>

                            </button>

                        </Link>

                    </div>

                    <div className="col-12 md:col-6">

                        <Link href="/landing">

                            <button
                                className="
                                    p-button-outlined
                                    p-button-secondary
                                    p-component
                                    w-full
                                "
                            >

                                <i className="pi pi-sign-out mr-2" />

                                <span>
                                    Cerrar Sesión
                                </span>

                            </button>

                        </Link>

                    </div>

                </div>

                <div className="mt-5 pt-4 border-top-1 surface-border">

                    <div className="flex align-items-center justify-content-between flex-wrap gap-3">

                        <div className="text-500 text-sm">

                            Código de seguridad:
                            <span className="font-semibold ml-2">
                                ERR-403
                            </span>

                        </div>

                        <div className="text-500 text-sm">

                            Contacta al administrador si crees
                            que esto es un error.

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}