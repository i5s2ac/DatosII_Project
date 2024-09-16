"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '../../../components/Layout'; // Ajusta la ruta según tu estructura de carpetas
import {
    CalendarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";

export default function UserPage({ params }) {
    const { userId } = params;
    const [username, setUsername] = useState("");
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeTab, setActiveTab] = useState('oferta'); // Pestañas para alternar entre detalles de la oferta y la empresa

    // Filtros
    const [searchTermUbicacion, setSearchTermUbicacion] = useState("");
    const [searchTermTitulo, setSearchTermTitulo] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [modalityFilter, setModalityFilter] = useState("");

    const router = useRouter();

    useEffect(() => {
        // Fetch del username dentro del useEffect
        const fetchUsername = async () => {
            try {
                const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
                if (!token) {
                    throw new Error("Token no encontrado");
                }
                const res = await fetch(`/api/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Asegúrate de enviar el token correctamente
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setUsername(data.user.username);
                } else {
                    router.push("/auth/login"); // Redirigir si no es exitoso
                }
            } catch (error) {
                console.error("Error fetching username:", error);
                router.push("/auth/login");
            }
        };

        fetchUsername();
    }, [userId, router]); // Agregado router como dependencia

    useEffect(() => {
        // Fetch de ofertas de empleo
        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/user/${userId}/ofertas`);
                if (!response.ok) {
                    throw new Error('Error al obtener las ofertas de empleo');
                }
                const data = await response.json();

                if (data.success) {
                    setJobs(data.ofertas);
                    setFilteredJobs(data.ofertas); // Inicialmente, todas las ofertas se muestran
                } else {
                    console.error('Error al obtener las ofertas:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener las ofertas de empleo:', error);
            }
        };

        fetchJobs();
    }, [userId]);

    // Aplicación de filtros
    useEffect(() => {
        let filtered = jobs;

        // Filtro por ubicación
        if (searchTermUbicacion) {
            filtered = filtered.filter((offer) =>
                offer.ubicacion.toLowerCase().includes(searchTermUbicacion.toLowerCase())
            );
        }

        // Filtro por título
        if (searchTermTitulo) {
            filtered = filtered.filter((offer) =>
                offer.titulo.toLowerCase().includes(searchTermTitulo.toLowerCase())
            );
        }

        // Filtro por fecha de publicación
        if (dateFilter) {
            filtered = filtered.filter((offer) => {
                const daysAgo =
                    (new Date() - new Date(offer.fechaPublicacion)) /
                    (1000 * 60 * 60 * 24);
                if (dateFilter === "7") return daysAgo <= 7;
                if (dateFilter === "30") return daysAgo <= 30;
                if (dateFilter === "over30") return daysAgo > 30;
                return true;
            });
        }

        // Filtro por salario
        if (salaryFilter) {
            filtered = filtered.filter((offer) => {
                if (salaryFilter === "low") return offer.salario <= 1000;
                if (salaryFilter === "medium") return offer.salario > 1000 && offer.salario <= 5000;
                if (salaryFilter === "high") return offer.salario > 5000;
                return true;
            });
        }

        // Filtro por tipo de trabajo
        if (typeFilter) {
            filtered = filtered.filter((offer) => offer.tipoTrabajo === typeFilter);
        }

        // Filtro por modalidad
        if (modalityFilter) {
            filtered = filtered.filter((offer) => offer.modalidad === modalityFilter);
        }

        setFilteredJobs(filtered);
    }, [searchTermUbicacion, searchTermTitulo, dateFilter, salaryFilter, typeFilter, modalityFilter, jobs]);

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setActiveTab('oferta'); // Restablecer a la pestaña "Oferta" al seleccionar un nuevo trabajo
    };

    const renderOfferDetails = () => (
        <>
            <div className="mt-6">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                    Descripción del trabajo
                </h3>

                <p className="mt-6 text-gray-700 leading-relaxed text-md text-justify">
                    {selectedJob.descripcion}
                </p>
                <p className="text-gray-500 text-lg">{selectedJob.empresa?.nombre || 'Empresa no especificada'}</p>
                <p className="text-gray-500 text-lg">{selectedJob.ubicacion || 'Ubicación no especificada'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-base md:text-lg mb-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full">
                    {selectedJob.modalidad || 'Modalidad no especificada'}
                </span>
                {selectedJob.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-600 text-2xl rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
            <button
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-200 shadow-lg">
                Aplicar ahora
            </button>
        </>
    );

    const renderCompanyDetails = () => (
        <>
            {selectedJob.empresa ? (
                <div className="mt-12 space-y-8">
                    <h3 className="text-4xl font-bold mb-6 text-gray-800">
                        <BuildingOfficeIcon className="h-8 w-8 inline-block text-blue-600 mr-3 mb-1"/>
                        Información de la Empresa
                    </h3>

                    <div className="flex items-center space-x-3 text-gray-700">
                        <p className="text-lg font-medium leading-relaxed">
                            Aquí puedes consultar todos los detalles sobre la empresa que está ofreciendo esta oportunidad de trabajo.
                        </p>
                    </div>

                    {/* Nombre */}
                    <div className="p-6 bg-white text-blue-800 rounded-xl shadow-md flex items-center space-x-4">
                        <BuildingOfficeIcon className="h-6 w-6"/>
                        <div>
                            <p className="text-lg font-semibold">Nombre de la Empresa</p>
                            <p className="text-xl">{selectedJob.empresa.nombre || 'Empresa no especificada'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Descripción */}
                        <div className="p-6 bg-white text-yellow-800 rounded-xl shadow-md flex items-center space-x-4">
                            <BuildingOfficeIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Descripción</p>
                                <p className="text-xl">{selectedJob.empresa.descripcion || 'No especificada'}</p>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="p-6 bg-white text-green-800 rounded-xl shadow-md flex items-center space-x-4">
                            <MapPinIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Dirección</p>
                                <p className="text-xl">{selectedJob.empresa.direccion || 'No especificada'}</p>
                            </div>
                        </div>

                    </div>

                    {/* Sitio Web */}
                    <div className="p-6 bg-white text-indigo-800 rounded-xl shadow-md flex items-center space-x-4">
                        <GlobeAltIcon className="h-6 w-6"/>
                        <div>
                            <p className="text-lg font-semibold">Sitio Web</p>
                            {selectedJob.empresa.sitioWeb ? (
                                <a
                                    href={selectedJob.empresa.sitioWeb}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl font-bold text-indigo-600 hover:underline"
                                >
                                    {selectedJob.empresa.sitioWeb}
                                </a>
                            ) : (
                                <p className="text-xl">No especificado</p>
                            )}
                        </div>
                    </div>

                    <h3 className="text-4xl font-bold mt-6 text-gray-800">
                        <BuildingOfficeIcon className="h-8 w-8 inline-block text-blue-600 mr-3 mb-3"/>
                        Información de Contacto
                    </h3>

                    <div className="flex items-center space-x-3 text-gray-700">
                        <p className="text-lg font-medium leading-relaxed">
                            Aquí puedes consultar todos los detalles sobre el creador de la oportunidad de trabajo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* Teléfono */}
                        <div className="p-6 bg-white text-red-800 rounded-xl shadow-md flex items-center space-x-4">
                            <PhoneIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Teléfono</p>
                                <p className="text-xl">{selectedJob.empresa.telefono || 'No especificado'}</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="p-6 bg-white text-purple-800 rounded-xl shadow-md flex items-center space-x-4">
                            <EnvelopeIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Email</p>
                                <p className="text-xl">{selectedJob.empresa.email || 'No especificado'}</p>
                            </div>
                        </div>

                    </div>


                </div>
            ) : (
                <p className="text-gray-700">Información de la empresa no disponible.</p>
            )}
        </>
    );

    return (
        <Layout userId={userId}>
            <div className="min-h-screen flex flex-col bg-white">
                <main className="flex-grow p-6">
                    <div
                        className="flex justify-between items-center mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/images/Profile.jpg"  // Ruta de la imagen de perfil
                                alt="Profile Picture"
                                className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-medium text-gray-900">
                                    ¡Hola, {username}!
                                </h1>

                                <p className="text-md text-gray-500 mt-1">
                                    Estamos listos para ayudarte a encontrar tu próximo reto
                                </p>
                            </div>
                        </div>
                        <div>
                            <button
                                className="px-5 py-2 bg-blue-600 text-white border border-gray-300 rounded-lg hover:bg-blue-700 transition focus:outline-none"
                            >
                                <Link href={`/home/user/${userId}/edit`}>
                                    Editar Perfil
                                </Link>
                            </button>
                        </div>
                    </div>
                    {/* Barra de búsqueda y filtros */}
                    <section className="my-8 max-w-8xl">
                        <form className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={searchTermTitulo}
                                        onChange={(e) => setSearchTermTitulo(e.target.value)}
                                        placeholder="Buscar por título o palabra clave"
                                        className="w-full pl-10 px-4 py-3 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <BriefcaseIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={searchTermUbicacion}
                                        onChange={(e) => setSearchTermUbicacion(e.target.value)}
                                        placeholder="Ubicación"
                                        className="w-full pl-10 px-4 py-3 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="relative">
                                    <CalendarIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <select
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="w-full pl-10 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Fecha de publicación</option>
                                        <option value="7">Últimos 7 días</option>
                                        <option value="30">Últimos 30 días</option>
                                        <option value="over30">Hace más de 30 días</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <CurrencyDollarIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <select
                                        value={salaryFilter}
                                        onChange={(e) => setSalaryFilter(e.target.value)}
                                        className="w-full pl-10 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Salario</option>
                                        <option value="low">Menos de $1000</option>
                                        <option value="medium">Entre $1000 y $5000</option>
                                        <option value="high">Más de $5000</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <BriefcaseIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full pl-10 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tipo de trabajo</option>
                                        <option value="Tiempo completo">Tiempo completo</option>
                                        <option value="Medio tiempo">Medio tiempo</option>
                                        <option value="Temporal">Temporal</option>
                                        <option value="Contrato">Contrato</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <BriefcaseIcon
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <select
                                        value={modalityFilter}
                                        onChange={(e) => setModalityFilter(e.target.value)}
                                        className="w-full pl-10 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Modalidad</option>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Remoto">Remoto</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>
                        </form>

                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            Resultados de búsqueda
                        </h2>

                        <p className="text-gray-500 mb-4">{filteredJobs.length} trabajos encontrados</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Lista de trabajos */}
                            <div className="bg-white rounded-lg min-h-[590px] overflow-y-auto">
                                <div className="space-y-4">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() => handleJobClick(job)}
                                                className={`cursor-pointer bg-white rounded-lg shadow-md p-4 hover:shadow-lg border ${
                                                    selectedJob && selectedJob.id === job.id
                                                        ? 'border-blue-500'
                                                        : 'border-gray-200'
                                                } transition duration-200`}
                                            >

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                            <span
                                                                className="text-lg font-bold text-white">{job.titulo.charAt(0)}</span>
                                                        </div>
                                                        {/* Título */}
                                                        <div className="ml-4">
                                                            <p className="text-lg font-semibold text-gray-900 truncate">
                                                                {job.titulo.length > 20 ? `${job.titulo.substring(0, 20)}...` : job.titulo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600">Compañía: {job.empresa?.nombre || 'Empresa no especificada'}</p>
                                                <p className="text-gray-500 mt-2 text-md">{job.descripcion}</p>

                                                <p className="mt-2 text-gray-500 text-md">Ubicación: {job.ubicacion}</p>

                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-md">
                                                    <span className="text-gray-900 font-semibold">
                                                        Oferta Salarial: {job.salario ? `Q${job.salario}` : 'Salario no especificado'}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-md">
                                                    <span
                                                        className="px-3 py-1 bg-green-200 text-green-700 rounded-full font-medium">
                                                        {job.tipoTrabajo || 'Tipo no especificado'}
                                                    </span>
                                                    <span
                                                        className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-medium">
                                                        {job.modalidad || 'Modalidad no especificada'}
                                                    </span>

                                                    {job.tags?.map((tag, index) => (
                                                        <span key={index}
                                                              className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full font-medium">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p>No se encontraron ofertas de trabajo</p>
                                    )}
                                </div>
                            </div>

                            {/* Detalles del trabajo con pestañas */}
                            {selectedJob ? (
                                <div
                                    className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                                    <div className="flex items-center mb-4">

                                        <div>
                                            <div
                                                className="mt-4 bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                <span
                                                    className="text-lg font-bold text-white">{selectedJob.titulo.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <h2 className="ml-4 mt-4 text-3xl font-bold text-gray-800">{selectedJob.titulo}</h2>
                                    </div>

                                    <div className="flex py-6 space-x-4">
                                        <div className="px-6 py-4 bg-green-100 text-green-800 text-center rounded-2xl">
                                            <div className="text-sm">Salario</div>
                                            <div className="text-2xl font-bold">Q{selectedJob.salario} <span
                                                className="text-base font-normal">/Month</span>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 bg-blue-100 text-blue-800 text-center rounded-2xl">
                                            <div className="text-sm">Tipo de Empleo</div>
                                            <div
                                                className="text-2xl font-bold">{selectedJob.tipoTrabajo || 'Tipo no especificado'}</div>
                                        </div>

                                        <div
                                            className="px-6 py-4 bg-orange-100 text-orange-800 text-center rounded-2xl">
                                            <div className="text-sm">Modalidad</div>
                                            <div
                                                className="text-2xl font-bold">{selectedJob.modalidad || 'Modalidad no especificada'}</div>
                                        </div>

                                        <div
                                            className="px-6 py-4 bg-purple-100 text-purple-800 text-center rounded-2xl">
                                            <div className="text-sm">Skill</div>
                                            <div className="text-2xl font-bold">Expert</div>
                                        </div>
                                    </div>

                                    {/* Pestañas */}
                                    <div className="mb-6 border-b border-gray-200">
                                        <nav className="-mb-px flex space-x-8">

                                            <button
                                                onClick={() => setActiveTab('oferta')}
                                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                                                    activeTab === 'oferta'
                                                        ? 'border-blue-600 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                Información de la oferta
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('empresa')}
                                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                                                    activeTab === 'empresa'
                                                        ? 'border-blue-600 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                Información de la empresa
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Contenido de las pestañas */}
                                    {activeTab === 'oferta' ? renderOfferDetails() : renderCompanyDetails()}
                                </div>
                            ) : (
                                <div className="col-span-1 md:col-span-3 flex items-center justify-center">
                                    <p className="text-gray-500 text-xl">Selecciona una oferta para ver los detalles</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </Layout>
    );
}
