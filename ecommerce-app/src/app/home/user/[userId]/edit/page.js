"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Layout from '../../../../components/Layout';

const MySwal = withReactContent(Swal);

export default function UserPage({ params }) {
    const { userId, empresaId, rolId } = params;  // Recoge los parámetros
    const router = useRouter();

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        telefono: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Asegúrate de obtener el token
                const res = await fetch(`/api/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setUserData({
                        username: data.user.username,
                        email: data.user.email,
                        telefono: data.user.telefono,
                    });
                } else {
                    throw new Error('Error al cargar los datos del usuario');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                MySwal.fire({
                    title: 'Error',
                    text: 'Hubo un error al cargar los datos del usuario',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                });
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');  // Agregar token para la autenticación
            const res = await fetch(`/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Autorización con token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),  // Envía todos los datos
            });

            if (res.ok) {
                MySwal.fire({
                    title: '¡Actualizado!',
                    text: 'Los datos del usuario han sido actualizados exitosamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                // Redirige a la página anterior
                setTimeout(() => {
                    router.back();
                }, 1500);
            } else {
                throw new Error('Error al actualizar los datos del usuario');
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar los datos del usuario. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Entendido',
            });
        }
    };

    return (
        <Layout userId={userId} empresaId={empresaId} rolId={rolId}>
            <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg">
                <div className="flex items-center mb-6">
                    <ArrowLeftIcon
                        className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                        onClick={() => router.back()}
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Actualizar Datos del Usuario</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-lg font-medium text-gray-700">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={userData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-lg font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={userData.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Actualizar Usuario
                    </button>
                </form>
            </div>
        </Layout>
    );
}
