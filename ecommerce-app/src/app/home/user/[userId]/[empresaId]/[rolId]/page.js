"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../../../components/Navbar";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CalendarIcon, CurrencyDollarIcon, BriefcaseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


const MySwal = withReactContent(Swal);

export default function UserPage({ params }) {
    const { userId, empresaId, rolId } = params;
    const [username, setUsername] = useState("");
    const [jobOffers, setJobOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermUbicacion, setSearchTermUbicacion] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [modalityFilter, setmodalityFilter] = useState("");
    const [userOfferCount, setUserOfferCount] = useState(0);
    const [companyOfferCount, setCompanyOfferCount] = useState(0);
    const [activeJobCount, setActiveJobCount] = useState(0);
    const [inactiveJobCount, setInactiveJobCount] = useState(0);
    const [activeTab, setActiveTab] = useState("pending"); // Controla la pestaña activa


    const router = useRouter();

    const handleCreateOfferClick = () => {
        router.push(`/home/user/${userId}/${empresaId}/${rolId}/create_offer`);
    };


    // Datos ficticios para candidatos pendientes y para historial
    const pendingCandidates = [
        {
            jobTitle: "Desarrollador Full-Stack",
            salary: 15000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Carlos Méndez",
            tags: ["Full Time", "1 Year Experience"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
        {
            jobTitle: "Diseñador UI/UX",
            salary: 12000,
            candidatePhoto: "/images/Profile.jpg",
            candidateName: "Ana Martínez",
            tags: ["Part Time", "Senior"],
            status: "Pending",
        },
    ];

    const historyCandidates = [
        {
            jobTitle: "Analista de Datos",
            salary: 18000,
            candidatePhoto: "/images/candidate3.jpg",
            candidateName: "Luis Ramírez",
            tags: ["Full Time", "2 Years Experience"],
            status: "Accepted",
        },
        {
            jobTitle: "Desarrollador Backend",
            salary: 16000,
            candidatePhoto: "/images/candidate4.jpg",
            candidateName: "María González",
            tags: ["Full Time", "5 Years Experience"],
            status: "Declined",
        },
    ];


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchUsername = async () => {
            try {
                const res = await fetch(`/api/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setUsername(data.user.username);
                }
            } catch (error) {
                console.error("Error fetching username:", error);
                router.push("/auth/login");
            }
        };

        const fetchJobOffers = async () => {
            try {
                const res = await fetch(`/api/ofertas?empresaId=${empresaId}&userId=${userId}`);
                const data = await res.json();
                if (data.success) {
                    setJobOffers(data.ofertas);

                    // Contar cuántas ofertas están activas e inactivas
                    const activeOffers = data.ofertas.filter(offer => offer.estatus === "Activo");
                    const inactiveOffers = data.ofertas.filter(offer => offer.estatus === "Inactivo");

                    setActiveJobCount(activeOffers.length);
                    setInactiveJobCount(inactiveOffers.length);
                } else {
                    console.error("No se encontraron ofertas");
                }
            } catch (error) {
                console.error("Error fetching job offers:", error);
            }
        };

        fetchUsername();
        fetchJobOffers();
    }, [userId, empresaId, router]);

    const filteredOffers = jobOffers
        .filter((offer) =>
            offer.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((offer) =>
            offer.ubicacion.toLowerCase().includes(searchTermUbicacion.toLowerCase())
        )
        .filter((offer) => {
            if (!dateFilter) return true;
            const daysAgo =
                (new Date() - new Date(offer.fechaPublicacion)) /
                (1000 * 60 * 60 * 24);
            if (dateFilter === "7") return daysAgo <= 7;
            if (dateFilter === "30") return daysAgo <= 30;
            if (dateFilter === "over30") return daysAgo > 30;
            return true;
        })
        .filter((offer) =>
            salaryFilter ? parseFloat(offer.salario) <= parseFloat(salaryFilter) : true
        )
        .filter((offer) =>
            typeFilter ? offer.tipoTrabajo.includes(typeFilter) : true
        )
        .filter((offer) =>
                modalityFilter ? offer.modalidad.includes(modalityFilter) : true
            );

    // Función para eliminar una oferta con SweetAlert2
    const handleDeleteOffer = async (offerId) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: "¡Recuerda que no podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/ofertas/${offerId}/delete`, {
                        method: 'DELETE',
                    });
                    if (res.ok) {
                        // Si la oferta se eliminó con éxito, actualiza la lista de ofertas
                        setJobOffers((prevOffers) => prevOffers.filter(offer => offer.id !== offerId));
                        Swal.fire(
                            '¡Eliminado!',
                            'La oferta ha sido eliminada.',
                            'success'
                        );

                    } else {
                        throw new Error('Error al eliminar la oferta');
                    }
                } catch (error) {
                    Swal.fire('Error', `Hubo un error al eliminar la oferta: ${error.message}`, 'error');
                }
            }
        });
    };

    const handleToggleStatus = async (offerId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';

            const res = await fetch(`/api/ofertas/${offerId}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estatus: newStatus }),
            });

            const data = await res.json();

            if (data.success) {
                window.location.reload();  // Recargar la página si la acción fue exitosa
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error al cambiar el estatus:', error);
        }
    };

    const calcularDiasDesdePublicacion = (fechaPublicacion) => {
        const ahora = new Date();
        const fechaPublicacionDate = new Date(fechaPublicacion);
        const diferenciaTiempo = ahora - fechaPublicacionDate; // Diferencia en milisegundos
        const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir a días
        return diferenciaDias;
    };


    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        vertical: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        appendDots: (dots) => (
            <div style={{ marginTop: "40px" }}>
                <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar userId={userId} empresaId={empresaId} rolId={rolId} />

            <main className="flex-grow p-6 mt-4">
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

                            <p className="text-md text-gray-500 mt-1">Estamos listos para ayudarte a encontrar tu
                                próximo reto</p>
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


                {/* Tarjetas de Resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {/* Tarjeta de Crear Trabajo */}
                    <div
                        className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between">
                        {/* Icono y Título */}
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <PlusCircleIcon className="h-10 w-10 text-blue-600"/>
                                <h2 className="text-2xl font-semibold text-gray-800">Crear Trabajo</h2>
                            </div>

                            {/* Descripción */}
                            <p className="text-gray-600 mb-6 text-lg">
                                Publica una nueva oferta de trabajo y encuentra el candidato ideal para tu empresa.
                                Comienza
                                hoy mismo a construir el equipo de tus sueños.
                            </p>
                        </div>

                        {/* Botón fijo */}
                        <button
                            onClick={handleCreateOfferClick}
                            className="bg-blue-600 text-white  w-full py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Crear Trabajo
                        </button>
                    </div>

                    {/* Tarjeta de Plazas Activas */}
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 relative">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-green-500 rounded-full h-12 w-12 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">{activeJobCount}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Plazas Activas</h2>
                                <p className="text-gray-500">Actualmente abiertas</p>
                            </div>
                        </div>

                        {/* Lista de plazas activas */}
                        <div className="overflow-y-auto max-h-40">
                            {jobOffers.filter(offer => offer.estatus === 'Activo').map((job) => (
                                <div key={job.id} className="mb-3">
                                    <p className="text-gray-800 font-medium">{job.titulo}</p>
                                    <p className="text-gray-500 text-sm">Publicado
                                        hace {calcularDiasDesdePublicacion(job.fechaPublicacion)} días</p>
                                </div>
                            ))}
                        </div>

                        {/* Botón fijo */}
                        <button
                            onClick={() => alert("Ver todas las plazas activas")}
                            className="bg-blue-600 text-white w-full py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Ver todas las plazas activas
                        </button>
                    </div>

                    {/* Tarjeta de Plazas Inactivas */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl border border-gray-200 transition-shadow duration-300 relative">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-red-500 rounded-full h-12 w-12 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">{inactiveJobCount}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Plazas Inactivas</h2>
                                <p className="text-gray-500">Cerradas o vencidas</p>
                            </div>
                        </div>

                        {/* Lista de plazas inactivas */}
                        <div className="overflow-y-auto max-h-40">
                            {jobOffers.filter(offer => offer.estatus === 'Inactivo').map((job) => (
                                <div key={job.id} className="mb-3">
                                    <p className="text-gray-800 font-medium">{job.titulo}</p>
                                    <p className="text-gray-500 text-sm">Publicado
                                        hace {calcularDiasDesdePublicacion(job.fechaPublicacion)} días</p>                                </div>
                            ))}
                        </div>

                        {/* Botón fijo */}
                        <button
                            onClick={() => alert("Ver todas las plazas inactivas")}
                            className="bg-blue-600 text-white w-full py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Ver todas las plazas inactivas
                        </button>
                    </div>




                </div>


                {/* Resto del código... */}


                {/* Carrusel de tarjetas */}
                <div className="bg-white py-12 rounded-lg">

                    <div
                        className="flex justify-between items-center mb-12 bg-white rounded-lg ">
                        <h1 className="text-3xl font-medium text-gray-900">
                            Tus ofertas actuales
                        </h1>

                        <div>
                            <button
                                onClick={handleCreateOfferClick}  // Acción para agregar nuevas ofertas
                                className="inline-flex items-center px-4 py-3 bg-blue-600 text-white text-md font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <PlusCircleIcon className="h-5 w-5 mr-2"/>
                                Crear Nueva Oferta de Trabajo
                            </button>
                        </div>

                    </div>
                    <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">

                        <div className="mb-6 relative">
                            {/* Input de búsqueda con icono */}
                            <div className="relative">
                                <MagnifyingGlassIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar ofertas de trabajo..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6 relative">
                            {/* Input de búsqueda con icono */}
                            <div className="relative">
                                <MagnifyingGlassIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar ofertas por ubicación..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={searchTermUbicacion}
                                    onChange={(e) => setSearchTermUbicacion(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Filtros adicionales */}
                        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Filtro de fecha */}
                            <div className="relative">
                                <CalendarIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <select
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="">Filtrar por fecha de publicación</option>
                                    <option value="7">Últimos 7 días</option>
                                    <option value="30">Últimos 30 días</option>
                                    <option value="over30">Más de 30 días</option>
                                </select>
                            </div>

                            {/* Filtro de salario */}
                            <div className="relative">
                                <CurrencyDollarIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <select
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={salaryFilter}
                                    onChange={(e) => setSalaryFilter(e.target.value)}
                                >
                                    <option value="">Filtrar por salario máximo</option>
                                    <option value="5000">Q5,000 o menos</option>
                                    <option value="10000">Q10,000 o menos</option>
                                    <option value="20000">Q20,000 o menos</option>
                                    <option value="100000">Q100,000 o menos</option>
                                    <option value="500000">Q500,000 o menos</option>
                                </select>
                            </div>

                            {/* Filtro de tipo de trabajo */}
                            <div className="relative">
                                <BriefcaseIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <select
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="">Filtrar por tipo de trabajo</option>
                                    <option value="Tiempo Completo">Tiempo Completo</option>
                                    <option value="Tiempo Parcial">Tiempo Parcial</option>
                                    <option value="Por Proyecto">Por Proyecto</option>

                                </select>
                            </div>

                            {/* Filtro de tipo de trabajo */}
                            <div className="relative">
                                <BriefcaseIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <select
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                    value={modalityFilter}
                                    onChange={(e) => setmodalityFilter(e.target.value)}
                                >
                                    <option value="">Filtrar por modalidad</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Híbrido">Híbrido</option>

                                </select>
                            </div>
                        </div>


                        {/* Mensaje de Resultados */}
                        <div className="mb-4 text-gray-700">
                            {filteredOffers.length}{" "}
                            {filteredOffers.length === 1
                                ? "resultado encontrado"
                                : "resultados encontrados"}
                        </div>

                        <div className="flex flex-wrap justify-between mb-4">

                            <div className="w-full md:w-1/3 pr-4">
                                <h2 className="text-2xl font-semibold text-gray-800 mt-8">Plazas Creadas</h2>
                                <p className="text-md text-gray-500 mt-3">Estamos listos para ayudarte a encontrar tu
                                    próximo reto</p>

                                {filteredOffers.length === 0 ? (
                                    <p className="text-gray-600 border border-gray-200 p-3 mt-4 rounded-md">No se
                                        encontraron
                                        ofertas de trabajo.</p>
                                ) : (
                                    <Slider {...settings}>
                                        {filteredOffers.map((offer) => (
                                            <div key={offer.id} className="p-2 mt-4">
                                                <div
                                                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out relative">

                                                    {/* Icono, Título y Menú */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                            <span
                                                                className="text-lg font-bold text-white">{offer.titulo.charAt(0)}</span>
                                                            </div>
                                                            {/* Título */}
                                                            <div className="mt-6 mb-4">
                                                                <p className="text-lg font-semibold text-gray-900 ml-4 truncate">
                                                                    {offer.titulo.length > 20 ? `${offer.titulo.substring(0, 20)}...` : offer.titulo}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Iconos de Editar y Eliminar */}
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => router.push(`/home/user/${userId}/${empresaId}/${rolId}/offers/edit/${offer.id}`)}
                                                                className="text-blue-600 hover:text-blue-800 transition">
                                                                <PencilIcon className="h-5 w-5"/>
                                                            </button>
                                                            <button onClick={() => handleDeleteOffer(offer.id)}
                                                                    className="text-red-600 hover:text-red-800 transition">
                                                                <TrashIcon className="h-5 w-5"/>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Descripción */}
                                                    <p className="text-gray-600 mb-4 text-md leading-tight">
                                                        {offer.descripcion.length > 100 ? `${offer.descripcion.substring(0, 100)}...` : offer.descripcion}
                                                    </p>

                                                    {/* Modalidad */}
                                                    <p className="text-gray-600 mb-4 text-md leading-tight">
                                                        Modalidad: {offer.modalidad}
                                                    </p>

                                                    {/* Tipo de Empleo */}
                                                    <p className="text-gray-600 mb-4 text-md leading-tight">
                                                        Tipo de empleo: {offer.tipoTrabajo}
                                                    </p>

                                                    {/* Salario */}
                                                    <div
                                                        className="text-md font-bold text-gray-600 mb-4">{`Q${parseFloat(offer.salario).toLocaleString()}`}</div>

                                                    {/* Etiquetas */}
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {/* Mostrar los tags de la oferta */}
                                                        {offer.tags && (
                                                            (Array.isArray(offer.tags) ? offer.tags : offer.tags.split(',')).map((tag, index) => (
                                                                <span key={index}
                                                                      className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-0.5 rounded">
                {tag.trim()}
            </span>
                                                            ))
                                                        )}
                                                    </div>

                                                    {/* Botones fijos */}
                                                    <div className="flex space-x-2 mt-6 border-t border-gray-200 pt-4">
                                                        <button
                                                            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                            Revisar Candidatos
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(offer.id, offer.estatus)}
                                                            className={`px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 ${offer.estatus === "Activo" ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"}`}
                                                        >
                                                            {offer.estatus === "Activo" ? "Desactivar Trabajo" : "Activar Trabajo"}
                                                        </button>


                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                )}
                            </div>




                            {/* Tabla de Candidatos - Derecha */}
                            <div className="w-full md:w-2/3 pl-4 ">

                                <h2 className="text-2xl font-semibold text-gray-800 mt-7 ">Candidatos</h2>
                                <p className="text-md text-gray-500 mt-3">Estamos listos para ayudarte a encontrar tu
                                    próximo reto</p>

                                <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200 ">
                                    {/* Pestañas */}
                                    <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
                                        <button onClick={() => setActiveTab("pending")}
                                                className={`py-2 px-4 rounded-t-lg border-b-2 border-gray-200 focus:outline-none ${activeTab === "pending" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-400"}`}>
                                            Candidatos Pendientes
                                        </button>
                                        <button onClick={() => setActiveTab("history")}
                                                className={`py-2 px-4 rounded-t-lg focus:outline-none ${activeTab === "history" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-400"}`}>
                                            Historial de Candidatos
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto" style={{maxHeight: '550px'}}>

                                        {/* Tabla de Candidatos Pendientes */}
                                        {activeTab === "pending" && (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border">
                                                    <thead>
                                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                                        <th className="py-3 px-6 text-left">Nombre del Puesto</th>
                                                        <th className="py-3 px-6 text-left">Salario</th>
                                                        <th className="py-3 px-6 text-left">Foto</th>
                                                        <th className="py-3 px-6 text-left">Candidato</th>
                                                        <th className="py-3 px-6 text-left">Tags</th>
                                                        <th className="py-3 px-6 text-left">Acciones</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="text-gray-600">
                                                    {pendingCandidates.map((candidate, index) => (
                                                        <tr key={index} className="border-b hover:bg-gray-50">
                                                            <td className="py-3 px-6">{candidate.jobTitle}</td>
                                                            <td className="py-3 px-6">Q{candidate.salary.toLocaleString()}</td>
                                                            <td className="py-3 px-6">
                                                                <img src={candidate.candidatePhoto}
                                                                     alt={candidate.candidateName}
                                                                     className="h-10 w-10 rounded-full"/>
                                                            </td>
                                                            <td className="py-3 px-6">{candidate.candidateName}</td>
                                                            <td className="py-3 px-6">
                                                                {candidate.tags.map((tag, i) => (
                                                                    <span key={i}
                                                                          className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full mr-1">
                        {tag}
                      </span>
                                                                ))}
                                                            </td>
                                                            <td className="py-3 px-6 flex space-x-2">
                                                                <button
                                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Aceptar
                                                                </button>
                                                                <button
                                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Rechazar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Tabla de Historial de Candidatos */}
                                        {activeTab === "history" && (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border">
                                                    <thead>
                                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                                        <th className="py-3 px-6 text-left">Nombre del Puesto</th>
                                                        <th className="py-3 px-6 text-left">Salario</th>
                                                        <th className="py-3 px-6 text-left">Foto</th>
                                                        <th className="py-3 px-6 text-left">Candidato</th>
                                                        <th className="py-3 px-6 text-left">Tags</th>
                                                        <th className="py-3 px-6 text-left">Estatus</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="text-gray-600">
                                                    {historyCandidates.map((candidate, index) => (
                                                        <tr key={index} className="border-b hover:bg-gray-50">
                                                            <td className="py-3 px-6">{candidate.jobTitle}</td>
                                                            <td className="py-3 px-6">Q{candidate.salary.toLocaleString()}</td>
                                                            <td className="py-3 px-6">
                                                                <img src={candidate.candidatePhoto}
                                                                     alt={candidate.candidateName}
                                                                     className="h-10 w-10 rounded-full"/>
                                                            </td>
                                                            <td className="py-3 px-6">{candidate.candidateName}</td>
                                                            <td className="py-3 px-6">
                                                                {candidate.tags.map((tag, i) => (
                                                                    <span key={i}
                                                                          className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full mr-1">
                        {tag}
                      </span>
                                                                ))}
                                                            </td>
                                                            <td className="py-3 px-6">
                    <span
                        className={`px-3 py-1 rounded-full text-xs ${candidate.status === "Accepted" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {candidate.status === "Accepted" ? "Aceptado" : "Rechazado"}
                    </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>


            </main>
        </div>
);
}

