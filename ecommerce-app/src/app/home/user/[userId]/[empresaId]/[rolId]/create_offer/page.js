"use client";

import Layout from '../../../../../../components/Layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function CreateOfferPage({ params }) {
    const { userId, empresaId, rolId } = params;
    const router = useRouter();

    const [offerData, setOfferData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        salario: '',
        fechaPublicacion: '',
        fechaCierre: '',
        empresaId: empresaId || '',
        userId: userId || "",
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' o 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfferData({
            ...offerData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/ofertas/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offerData),
            });

            if (res.ok) {
                setMessage('Oferta creada exitosamente.');
                setMessageType('success');
                setTimeout(() => {
                    router.back();
                }, 2000); // Redirige después de 2 segundos
            } else {
                throw new Error('Error al crear la oferta.');
            }
        } catch (error) {
            setMessage('Hubo un error al crear la oferta. Por favor, intenta de nuevo.');
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
            }, 3000); // Limpia el mensaje después de 3 segundos
        }
    };

    return (
        <Layout userId={userId} empresaId={empresaId} rolId={rolId}>
            {/* Mostrar mensaje de éxito o error */}
            {message && (
                <div className={`mt-4 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg">
                <div className="flex items-center mb-6">
                    <ArrowLeftIcon
                        className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                        onClick={() => router.back()}
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Crear oferta de trabajo</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.titulo}
                            onChange={handleChange}
                            placeholder="Ej. Desarrollador Full Stack"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe las responsabilidades del puesto..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">Ubicación</label>
                        <input
                            type="text"
                            id="ubicacion"
                            name="ubicacion"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.ubicacion}
                            onChange={handleChange}
                            placeholder="Ej. Ciudad de Guatemala, Remoto"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="salario" className="block text-lg font-medium text-gray-700">Salario</label>
                        <input
                            type="number"
                            id="salario"
                            name="salario"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.salario}
                            onChange={handleChange}
                            placeholder="Ej. 50000"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaPublicacion" className="block text-lg font-medium text-gray-700">Fecha de Publicación</label>
                        <input
                            type="date"
                            id="fechaPublicacion"
                            name="fechaPublicacion"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.fechaPublicacion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaCierre" className="block text-lg font-medium text-gray-700">Fecha de Cierre</label>
                        <input
                            type="date"
                            id="fechaCierre"
                            name="fechaCierre"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.fechaCierre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Crear Oferta
                    </button>
                </form>
            </div>
        </Layout>
    );
}
