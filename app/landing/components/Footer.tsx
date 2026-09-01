import { Button } from 'primereact/button';

export default function Footer() {
    return (
        <footer
            className="px-8 py-7"
            style={{
                background: '#0f172a',
                color: '#ffffff'
            }}
        >
            <div className="grid">
                {/* Empresa */}
                <div className="col-12 md:col-4 mb-5 md:mb-0">
                    <h2 className="mb-3">SOEC</h2>

                    <p
                        style={{
                            lineHeight: '1.8',
                            color: '#cbd5e1'
                        }}
                    >
                        Plataforma integral para gestión de salud ocupacional,
                        procesos empresariales y administración médica.
                    </p>
                </div>

                {/* Navegación */}
                <div className="col-12 md:col-4 mb-5 md:mb-0">
                    <h3 className="mb-3">Navegación</h3>

                    <div className="flex flex-column gap-2">
                        <span>Inicio</span>
                        <span>Beneficios</span>
                        <span>Testimonios</span>
                        <span>Contacto</span>
                    </div>
                </div>

                {/* Contacto */}
                <div className="col-12 md:col-4">
                    <h3 className="mb-3">Contacto</h3>

                    <div className="flex flex-column gap-3">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-envelope" />
                            <span>info@soec.com</span>
                        </div>

                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-phone" />
                            <span>+593 99 999 9999</span>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                icon="pi pi-facebook"
                                rounded
                                text
                                severity="secondary"
                            />

                            <Button
                                icon="pi pi-instagram"
                                rounded
                                text
                                severity="secondary"
                            />

                            <Button
                                icon="pi pi-linkedin"
                                rounded
                                text
                                severity="secondary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Línea inferior */}
            <div
                className="mt-7 pt-4 text-center"
                style={{
                    borderTop: '1px solid #334155',
                    color: '#94a3b8'
                }}
            >
                © 2026 SOEC - Todos los derechos reservados
            </div>
        </footer>
    );
}