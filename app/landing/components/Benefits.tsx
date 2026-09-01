import { Card } from 'primereact/card';

export default function Benefits() {
    const benefits = [
        {
            icon: 'pi pi-users',
            title: 'Gestión de Pacientes',
            description:
                'Administra información médica y ocupacional de forma centralizada.'
        },
        {
            icon: 'pi pi-chart-line',
            title: 'Reportes Inteligentes',
            description:
                'Visualiza métricas y estadísticas en tiempo real.'
        },
        {
            icon: 'pi pi-shield',
            title: 'Seguridad',
            description:
                'Protección y control de acceso para toda la información.'
        },
        {
            icon: 'pi pi-desktop',
            title: 'Dashboard Moderno',
            description:
                'Interfaz intuitiva y optimizada para múltiples dispositivos.'
        }
    ];

    return (
        <section
            className="px-8 py-8"
            style={{
                background: '#ffffff'
            }}
        >
            <div className="text-center mb-7">
                <h2
                    className="text-5xl font-bold mb-3"
                    style={{ color: '#0f172a' }}
                >
                    Beneficios del Sistema
                </h2>

                <p
                    className="text-xl"
                    style={{ color: '#64748b' }}
                >
                    Herramientas diseñadas para optimizar la gestión
                    empresarial y ocupacional.
                </p>
            </div>

            <div className="grid">
                {benefits.map((item, index) => (
                    <div
                        key={index}
                        className="col-12 md:col-6 lg:col-3"
                    >
                        <Card
                            className="h-full"
                            style={{
                                borderRadius: '20px',
                                transition: '0.3s',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <div className="text-center">
                                <i
                                    className={`${item.icon} text-5xl mb-4`}
                                    style={{
                                        color: '#3b82f6'
                                    }}
                                />

                                <h3
                                    className="text-2xl mb-3"
                                    style={{
                                        color: '#0f172a'
                                    }}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    style={{
                                        color: '#64748b',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </section>
    );
}