import { Button } from 'primereact/button';

export default function Hero() {
    return (
        <section
            className="flex align-items-center justify-content-between px-8 py-8"
            style={{
                minHeight: '80vh',
                background:
                    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}
        >
            {/* Texto */}
            <div style={{ maxWidth: '600px' }}>
                <h1
                    className="text-6xl font-bold mb-4"
                    style={{
                        lineHeight: '1.1',
                        color: '#0f172a'
                    }}
                >
                    Plataforma Integral de Salud Ocupacional
                </h1>

                <p
                    className="text-xl mb-5"
                    style={{
                        color: '#475569'
                    }}
                >
                    Gestiona procesos médicos, seguimiento ocupacional,
                    reportes y administración empresarial desde una sola
                    plataforma.
                </p>

                <div className="flex gap-3">
                    <Button
                        label="Comenzar"
                        icon="pi pi-arrow-right"
                        size="large"
                    />

                    <Button
                        label="Más información"
                        severity="secondary"
                        outlined
                        size="large"
                    />
                </div>
            </div>

            {/* Imagen visual */}
            <div className="hidden md:block">
                <img
                    src="/layout/images/hero-dashboard.png"
                    alt="Dashboard"
                    style={{
                        width: '700px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                    }}
                />
            </div>
        </section>
    );
}