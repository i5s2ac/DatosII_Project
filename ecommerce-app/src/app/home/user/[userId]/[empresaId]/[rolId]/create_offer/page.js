"use client";

import Layout from '../../../../../../components/Layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function CreateOfferPage({ params }) {
    const { userId, empresaId, rolId } = params;
    const router = useRouter();

    const [offerData, setOfferData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        salario: '',
        fechaCierre: '',
        estatus: 'Activo',
        empresaId: empresaId || '',
        userId: userId || "",
        tags: ['', '', ''], // Se permitirá agregar hasta 3 tags
        modalidad: 'Presencial', // Modalidad por defecto
        tipoTrabajo: 'Tiempo Completo', // Tipo de trabajo por defecto
    });

    // La fecha de publicación se asigna automáticamente a la fecha actual
    const fechaPublicacion = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfferData({
            ...offerData,
            [name]: value,
        });
    };

    // Manejo de cambios de los tags
    const handleTagChange = (e, index) => {
        const newTags = [...offerData.tags];
        newTags[index] = e.target.value;
        setOfferData({
            ...offerData,
            tags: newTags,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que la fecha de cierre sea mayor a la fecha actual
        const currentDate = new Date();
        const closingDate = new Date(offerData.fechaCierre);

        if (closingDate <= currentDate) {
            return MySwal.fire({
                title: 'Error',
                text: 'La fecha de cierre debe ser posterior a la fecha actual.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }

        // Filtrar tags vacíos
        const filteredTags = offerData.tags.filter(tag => tag.trim() !== '');

        if (filteredTags.length > 3) {
            return MySwal.fire({
                title: 'Error',
                text: 'Solo se permiten hasta 3 tags.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }

        try {
            const res = await fetch('/api/ofertas/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...offerData,
                    fechaPublicacion, // Se envía la fecha de publicación como la fecha actual
                    tags: filteredTags, // Asegúrate de que los tags se envíen como un array
                }),
            });

            if (res.ok) {
                // Mostrar SweetAlert2 para el éxito
                MySwal.fire({
                    title: '¡Oferta creada exitosamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.back();
                }, 1500); // Redirige después de 1.5 segundos
            } else {
                throw new Error('Error al crear la oferta.');
            }
        } catch (error) {
            // Mostrar SweetAlert2 para el error
            MySwal.fire({
                title: 'Error',
                text: 'Hubo un error al crear la oferta. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Entendido'
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
                        <label htmlFor="descripcion"
                               className="block text-lg font-medium text-gray-700">Descripción (255 caracteres)</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            maxLength="255"
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

                    {/* Tags */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Tags (Máximo 3)</label>
                        {[0, 1, 2].map((index) => (
                            <input
                                key={index}
                                type="text"
                                name={`tag-${index}`}
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary mb-2"
                                value={offerData.tags[index]}
                                onChange={(e) => handleTagChange(e, index)}
                                placeholder={`Tag ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Modalidad */}
                    <div>
                        <label htmlFor="modalidad" className="block text-lg font-medium text-gray-700">Modalidad</label>
                        <select
                            id="modalidad"
                            name="modalidad"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.modalidad}
                            onChange={handleChange}
                            required
                        >
                            <option value="Presencial">Presencial</option>
                            <option value="Hibrido">Híbrido</option>
                            <option value="Remoto">Remoto</option>
                        </select>
                    </div>

                    {/* Tipo de Trabajo */}
                    <div>
                        <label htmlFor="tipoTrabajo" className="block text-lg font-medium text-gray-700">Tipo de trabajo</label>
                        <select
                            id="tipoTrabajo"
                            name="tipoTrabajo"
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            value={offerData.tipoTrabajo}
                            onChange={handleChange}
                            required
                        >
                            <option value="Tiempo Completo">Tiempo Completo</option>
                            <option value="Tiempo Parcial">Tiempo Parcial</option>
                            <option value="Por Proyecto">Por Proyecto</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="fechaCierre" className="block text-lg font-medium text-gray-700">Fecha de
                            Cierre</label>
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
