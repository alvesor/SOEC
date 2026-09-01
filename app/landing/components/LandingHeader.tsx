'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { signIn } from 'next-auth/react';

export default function  LandingHeader() {
    const router = useRouter();

    const [identificacion, setIdentificacion] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

    const result = await signIn('credentials', {
        identificacion: identificacion,
        password: password,
        redirect: false
    });

    if (result?.ok) {
        router.push('/dashboard');
    } else {
        alert('Credenciales incorrectas');
    }
};

    return (
        <div
            className="flex justify-content-between align-items-center px-6 py-4 shadow-2"
            style={{
                background: '#ffffff',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}
        >
            {/* Logo */}
            <div>
                <h2 className="m-0">SOEC</h2>
                <small>Salud Ocupacional</small>
            </div>

            {/* Login */}
            <div className="flex align-items-center gap-2">
                <InputText
                    placeholder="Identificación"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                />

                <Password
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    feedback={false}
                    toggleMask
                />

                <Button
                    label="Ingresar"
                    icon="pi pi-sign-in"
                    onClick={handleLogin}
                />
            </div>
        </div>
    );
}