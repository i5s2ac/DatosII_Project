"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../../../../components/Navbar';  // Verifica la ruta correcta
import { useRouter } from 'next/navigation';

export default function UserPage({ params }) {
    const { userId, empresaId, rolId } = params;
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleCreateOfferClick = () => {
        router.push(`/home/user/${userId}/${empresaId}/${rolId}/create_offer`);
    };

    useEffect(() => {
        // Aquí podrías hacer alguna lógica para cargar datos o verificar permisos
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        // Ejemplo para cargar el nombre de usuario
        const fetchUsername = async () => {
            try {
                const res = await fetch(`/api/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setUsername(data.user.username);
                }
            } catch (error) {
                console.error('Error fetching username:', error);
                router.push('/auth/login');
            }
        };

        fetchUsername();
    }, [userId, router]);

    return (
        <div>
            <Navbar userId={userId} empresaId={empresaId} rolId={rolId} />

            <main className="flex-grow bg-white p-6">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleCreateOfferClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-300"
                    >
                        Crear Plaza de Trabajo
                    </button>
                </div>
                {/* Contenido adicional de la página */}
            </main>
        </div>
    );
}
