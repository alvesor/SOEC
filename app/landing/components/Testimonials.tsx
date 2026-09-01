import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';

export default function Testimonials() {
    const testimonials = [
        {
            name: 'Carlos Mendoza',
            role: 'Gerente Administrativo',
            message:
                'La plataforma nos permitió optimizar el control médico ocupacional y reducir tiempos operativos.',
            image: '/layout/images/avatar1.png'
        },
        {
            name: 'María Zambrano',
            role: 'Recursos Humanos',
            message:
                'El dashboard es intuitivo, rápido y fácil de utilizar para nuestro equipo.',
            image: '/layout/images/avatar2.png'
        },
        {
            name: 'Andrés López',
            role: 'Director Empresarial',
            message:
                'La generación de reportes y estadísticas mejoró significativamente la toma de decisiones.',
            image: '/layout/images/avatar3.png'
        }
    ];

    return (
        <section
            className="px-8 py-8"
            style={{
                background: '#f8fafc'
            }}
        >
            <div className="text-center mb-7">
                <h2
                    className="text-5xl font-bold mb-3"
                    style={{
                        color: '#0f172a'
                    }}
                >
                    Lo que dicen nuestros clientes
                </h2>

                <p
                    className="text-xl"
                    style={{
                        color: '#64748b'
                    }}
                >
                    Empresas que ya trabajan con nuestra plataforma.
                </p>
            </div>

            <div className="grid">
                {testimonials.map((item, index) => (
                    <div
                        key={index}
                        className="col-12 md:col-4"
                    >
                        <Card
                            className="h-full"
                            style={{
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <div className="flex flex-column align-items-center text-center">
                                <Avatar
                                    image={item.image}
                                    size="xlarge"
                                    shape="circle"
                                    className="mb-4"
                                />

                                <h3
                                    className="mb-1"
                                    style={{
                                        color: '#0f172a'
                                    }}
                                >
                                    {item.name}
                                </h3>

                                <small
                                    className="mb-4"
                                    style={{
                                        color: '#64748b'
                                    }}
                                >
                                    {item.role}
                                </small>

                                <p
                                    style={{
                                        color: '#475569',
                                        lineHeight: '1.8'
                                    }}
                                >
                                    "{item.message}"
                                </p>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </section>
    );
}