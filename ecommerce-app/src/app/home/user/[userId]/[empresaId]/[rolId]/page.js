"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../../../components/Navbar";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function UserPage({ params }) {
    const { userId, empresaId, rolId } = params;
    const [username, setUsername] = useState("");
    const [jobOffers, setJobOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [userOfferCount, setUserOfferCount] = useState(0);
    const [companyOfferCount, setCompanyOfferCount] = useState(0);

    const router = useRouter();

    const handleCreateOfferClick = () => {
        router.push(`/home/user/${userId}/${empresaId}/${rolId}/create_offer`);
    };

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

                    // Contar cuántas ofertas son del usuario y cuántas de la empresa
                    const userOffers = data.ofertas.filter(
                        (offer) => offer.userId === parseInt(userId)
                    );
                    setUserOfferCount(userOffers.length);
                    setCompanyOfferCount(data.ofertas.length);
                } else {
                    console.error("Failed to fetch job offers:", data.message);
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
            typeFilter ? offer.tipo.includes(typeFilter) : true
        )

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

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        appendDots: (dots) => (
            <div style={{ marginTop: "40px" }}>
                <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
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

            <main className="flex-grow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bienvenido, {username}
                    </h1>

                </div>

                {/* Tarjetas de Resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Plazas Creadas por la Empresa</h2>
                        <p className="text-4xl font-bold">{companyOfferCount}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-red-500 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Plazas Creadas por Ti</h2>
                        <p className="text-4xl font-bold">{userOfferCount}</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-400 to-blue-500 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Plazas Creadas por Ti</h2>
                        <p className="text-4xl font-bold">{userOfferCount}</p>
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar ofertas de trabajo..."
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filtros adicionales */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <select
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="">Filtrar por fecha de publicación</option>
                        <option value="7">Últimos 7 días</option>
                        <option value="30">Últimos 30 días</option>
                        <option value="over30">Más de 30 días</option>
                    </select>

                    <select
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                    <select
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">Filtrar por tipo de trabajo</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                {/* Mensaje de Resultados */}
                <div className="mb-4 text-gray-700">
                    {filteredOffers.length}{" "}
                    {filteredOffers.length === 1
                        ? "resultado encontrado"
                        : "resultados encontrados"}
                </div>

                {/* Carrusel de tarjetas */}
                <div className="bg-white py-12 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tus ofertas actuales
                        </h1>
                        <button
                            onClick={handleCreateOfferClick}
                            className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Crear Plaza de Trabajo
                        </button>
                    </div>

                    {filteredOffers.length === 0 ? (
                        <p className="text-gray-600">No se encontraron ofertas de trabajo.</p>
                    ) : (
                        <Slider {...settings}>
                            {filteredOffers.map((offer) => (
                                <div key={offer.id} className="p-2">
                                    <div
                                        className="bg-white rounded-xl shadow-lg p-6 relative hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-700">
                            {offer.titulo.charAt(0)}
                          </span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {offer.titulo}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Publicado hace{" "}
                                                        {Math.floor(
                                                            (new Date() - new Date(offer.fechaPublicacion)) /
                                                            (1000 * 60 * 60 * 24)
                                                        )}{" "}
                                                        días
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => router.push(`/home/user/${userId}/${empresaId}/${rolId}/offers/edit/${offer.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                >
                                                    <PencilIcon className="h-5 w-5"/>
                                                </button>

                                                <button
                                                onClick={() => handleDeleteOffer(offer.id)}  // Aquí se llama a la función de eliminación
                                                className="text-red-600 hover:text-red-800 transition"
                                                >
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>

                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mt-4">
                                            {offer.titulo}
                                        </h3>
                                        <p className="text-gray-600 mt-2">{offer.descripcion}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        {offer.tipo}
                      </span>
                                        </div>
                                        <div className="mt-6 border-t border-gray-200 pt-4">
                                            <p className="text-lg font-semibold text-gray-900">
                                                Q{parseFloat(offer.salario).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">{offer.ubicacion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </main>
        </div>
    );
}
