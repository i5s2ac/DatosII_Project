"use client";

import Layout from '../../../../../../components/Layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
        empresaId: empresaId || '', // Esto debería estar asociado con la empresa actual del usuario
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfferData({
            ...offerData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/ofertas/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(offerData),
        });

        if (res.ok) {
            router.push(`/home/user/${userId}/${empresaId}/${rolId}/create_offer`);
        } else {
            console.error('Error creating job offer');
        }
    };

    return (
        <Layout userId={userId} empresaId={empresaId} rolId={rolId}>
            <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">Ubicación</label>
                        <input
                            type="text"
                            id="ubicacion"
                            name="ubicacion"
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.ubicacion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="salario" className="block text-lg font-medium text-gray-700">Salario</label>
                        <input
                            type="number"
                            id="salario"
                            name="salario"
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.salario}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaPublicacion" className="block text-lg font-medium text-gray-700">Fecha de Publicación</label>
                        <input
                            type="date"
                            id="fechaPublicacion"
                            name="fechaPublicacion"
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
