"use client";

import Layout from '../../../../../../../../components/Layout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function EditOfferPage({ params }) {
    const { userId, empresaId, rolId, offerId } = params;
    const router = useRouter();

    const [offerData, setOfferData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        salario: '',
        fechaCierre: '',
        estatus: 'Activo',
        empresaId: empresaId || '',
        userId: userId || '',
        tags: ['', '', ''], // Hasta 3 tags inicializados como un array vacío
        modalidad: 'Presencial', // Modalidad por defecto
        tipoTrabajo: 'Tiempo Completo', // Tipo de trabajo por defecto

        // Nuevos campos requeridos
        Funciones_Requerimiento: '',
        Estudios_Requerimiento: '',
        Experiencia_Requerimiento: '',
        Conocimientos_Requerimiento: '',
        Competencias__Requerimiento: '',
    });

    // Obtener los datos existentes de la oferta al montar el componente
    useEffect(() => {
        const fetchOfferData = async () => {
            try {
                const res = await fetch(`/api/OffersCompany/${offerId}`);
                const data = await res.json();

                if (res.ok && data.oferta) {
                    let tags = ['', '', ''];
                    if (Array.isArray(data.oferta.tags)) {
                        tags = data.oferta.tags;
                    } else if (typeof data.oferta.tags === 'string') {
                        tags = data.oferta.tags.split(',').map(tag => tag.trim());
                    }

                    setOfferData({
                        ...offerData,
                        ...data.oferta,
                        fechaCierre: data.oferta.fechaCierre ? data.oferta.fechaCierre.split('T')[0] : '',
                        tags: tags.length === 3 ? tags : [...tags, ...Array(3 - tags.length).fill('')],

                        // Asignar los nuevos campos, asegurando que existan
                        Funciones_Requerimiento: data.oferta.Funciones_Requerimiento || '',
                        Estudios_Requerimiento: data.oferta.Estudios_Requerimiento || '',
                        Experiencia_Requerimiento: data.oferta.Experiencia_Requerimiento || '',
                        Conocimientos_Requerimiento: data.oferta.Conocimientos_Requerimiento || '',
                        Competencias__Requerimiento: data.oferta.Competencias__Requerimiento || '',
                    });
                } else {
                    throw new Error('Error al cargar los datos de la oferta');
                }
            } catch (error) {
                MySwal.fire({
                    title: 'Error',
                    text: 'Hubo un error al cargar los datos de la oferta',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        };

        if (offerId) fetchOfferData();  // Solo llama a la función si el 'offerId' está presente
    }, [offerId]);

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

    // Manejo de cambios de los nuevos campos requeridos
    const handleNewFieldChange = (e) => {
        const { name, value } = e.target;
        setOfferData({
            ...offerData,
            [name]: value,
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

        // Validaciones adicionales para los nuevos campos (opcional)
        // Ejemplo: verificar que los campos no excedan cierta longitud
        if (offerData.Funciones_Requerimiento.length > 500) {
            return MySwal.fire({
                title: 'Error',
                text: 'Funciones Requerimiento no puede exceder los 500 caracteres.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
        // Repite para otros campos según tus necesidades

        try {
            const res = await fetch(`/api/OffersCompany/${offerId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...offerData,
                    tags: filteredTags, // Enviar los tags como un arreglo
                }),
            });

            if (res.ok) {
                // Mostrar SweetAlert2 para el éxito
                MySwal.fire({
                    title: '¡Oferta actualizada exitosamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.back();
                }, 1500); // Redirige después de 1.5 segundos
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al actualizar la oferta.');
            }
        } catch (error) {
            // Mostrar SweetAlert2 para el error
            MySwal.fire({
                title: 'Error',
                text: error.message || 'Hubo un error al actualizar la oferta. Por favor, intenta de nuevo.',
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
                    <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">
                        Actualizar oferta de trabajo
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campos existentes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">
                                Título
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                maxLength="100"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.titulo}
                                onChange={handleChange}
                                placeholder="Ej. Desarrollador Full Stack"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">
                                Ubicación
                            </label>
                            <input
                                type="text"
                                id="ubicacion"
                                name="ubicacion"
                                maxLength="100"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.ubicacion}
                                onChange={handleChange}
                                placeholder="Ej. Ciudad de Guatemala"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">
                            Descripción (máximo 255 caracteres)
                        </label>
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
                        <label htmlFor="salario" className="block text-lg font-medium text-gray-700">
                            Salario
                        </label>
                        <input
                            type="number"
                            id="salario"
                            name="salario"
                            min="0"
                            max="1000000"
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
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[0, 1, 2].map((index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`tag-${index}`}
                                    maxLength="50"
                                    className="block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    value={offerData.tags[index]}
                                    onChange={(e) => handleTagChange(e, index)}
                                    placeholder={`Tag ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Nuevos Campos Requeridos */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="Funciones_Requerimiento" className="block text-lg font-medium text-gray-700">
                                Funciones Requerimiento
                            </label>
                            <textarea
                                id="Funciones_Requerimiento"
                                name="Funciones_Requerimiento"
                                maxLength="500" // Puedes ajustar la longitud según tus necesidades
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.Funciones_Requerimiento}
                                onChange={handleNewFieldChange}
                                placeholder="Describe las funciones requeridas para el puesto..."
                            />
                        </div>

                        <div>
                            <label htmlFor="Estudios_Requerimiento" className="block text-lg font-medium text-gray-700">
                                Estudios Requerimiento
                            </label>
                            <input
                                type="text"
                                id="Estudios_Requerimiento"
                                name="Estudios_Requerimiento"
                                maxLength="100" // Puedes ajustar la longitud según tus necesidades
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.Estudios_Requerimiento}
                                onChange={handleNewFieldChange}
                                placeholder="Ej. Ingeniería en Sistemas o afín."
                            />
                        </div>

                        <div>
                            <label htmlFor="Experiencia_Requerimiento" className="block text-lg font-medium text-gray-700">
                                Experiencia Requerimiento
                            </label>
                            <input
                                type="text"
                                id="Experiencia_Requerimiento"
                                name="Experiencia_Requerimiento"
                                maxLength="100" // Puedes ajustar la longitud según tus necesidades
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.Experiencia_Requerimiento}
                                onChange={handleNewFieldChange}
                                placeholder="Ej. 3 años en desarrollo backend."
                            />
                        </div>

                        <div>
                            <label htmlFor="Conocimientos_Requerimiento" className="block text-lg font-medium text-gray-700">
                                Conocimientos Requerimiento
                            </label>
                            <textarea
                                id="Conocimientos_Requerimiento"
                                name="Conocimientos_Requerimiento"
                                maxLength="500" // Puedes ajustar la longitud según tus necesidades
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.Conocimientos_Requerimiento}
                                onChange={handleNewFieldChange}
                                placeholder="Enumera los conocimientos específicos necesarios..."
                            />
                        </div>

                        <div>
                            <label htmlFor="Competencias__Requerimiento" className="block text-lg font-medium text-gray-700">
                                Competencias Requerimiento
                            </label>
                            <textarea
                                id="Competencias__Requerimiento"
                                name="Competencias__Requerimiento"
                                maxLength="500" // Puedes ajustar la longitud según tus necesidades
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.Competencias__Requerimiento}
                                onChange={handleNewFieldChange}
                                placeholder="Describe las competencias necesarias..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="modalidad" className="block text-lg font-medium text-gray-700">
                                Modalidad
                            </label>
                            <select
                                id="modalidad"
                                name="modalidad"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                value={offerData.modalidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Remoto">Remoto</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tipoTrabajo" className="block text-lg font-medium text-gray-700">
                                Tipo de trabajo
                            </label>
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
                            <label htmlFor="fechaCierre" className="block text-lg font-medium text-gray-700">
                                Fecha de Cierre
                            </label>
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
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Actualizar Oferta
                    </button>
                </form>
            </div>
        </Layout>
    );
}
