"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Layout from '../../../components/Layout';

export default function UserPage({ params }) {
    const { userId } = params;
    const [username, setUsername] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        order: '',
        date: '',
        category: '',
        location: '',
        experience: '',
        salary: '',
        workday: '',
        contract: ''
    });
    const [isWorkdayFilterOpen, setIsWorkdayFilterOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const router = useRouter();

    // Verifica el usuario
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const res = await fetch(`/api/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success && data.user.id === parseInt(userId)) {
                setUsername(data.user.username);
            } else {
                router.push('/auth/login');
            }
        };

        fetchUser();
    }, [router, userId]);

    // Obtener las ofertas de trabajo
    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const res = await fetch(`/api/user/${userId}/ofertas`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    if (data.ofertas && data.ofertas.length > 0) {
                        setJobs(data.ofertas);
                    } else {
                        console.log('No se encontraron ofertas de trabajo');
                    }
                } else {
                    console.error('Error al obtener ofertas:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener ofertas:', error);
            }
        };

        fetchJobs();
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        console.log("Search Query:", searchQuery);
        // Implementar la lógica de búsqueda aquí
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    return (
        <Layout userId={userId}>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow p-3" style={{ backgroundColor: '#ffffff' }}>
                    <section className="my-8">

                        {/* Barra de Búsqueda Responsiva */}
                        <div className="w-full flex items-center mb-8">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for jobs, companies..."
                                className="w-full px-6 py-3 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full focus:outline-none transition duration-200"
                            >
                                <Image src="/svg/lupa.svg" alt="Search" width={24} height={24} />
                            </button>
                        </div>

                        {/* Filtros en Tarjetas */}
                        <div className="flex flex-wrap gap-4 mb-8 px-3 relative">
                            {['Ordenar', 'Fecha', 'Categoría', 'Lugar de trabajo', 'Experiencia', 'Salario', 'Contrato'].map((filter, index) => (
                                <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 flex items-center">
                                    <span className="text-gray-700 font-medium">{filter}</span>
                                    <select
                                        name={filter.toLowerCase().replace(' ', '')}
                                        value={filters[filter.toLowerCase().replace(' ', '')]}
                                        onChange={handleFilterChange}
                                        className="ml-2 text-gray-500 focus:outline-none"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="option1">Opción 1</option>
                                        <option value="option2">Opción 2</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Lista de Trabajos y Detalles */}
                        <div className="flex flex-col md:flex-row min-h-screen">
                            {/* Lista de Trabajos */}
                            <div className="md:w-1/3 px-4 max-h-[520px] overflow-y-auto">
                                {jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => handleJobClick(job)}
                                            className={`cursor-pointer bg-white rounded-lg shadow-md p-8 mb-10 border-2 ${
                                                selectedJob && selectedJob.id === job.id ? "border-blue-500" : "border-transparent"
                                            }`}
                                        >
                                            <h3 className="text-lg font-semibold">{job.titulo}</h3>
                                            <p className="text-gray-600">{job.descripcion}</p>
                                            <p className="text-gray-500">{job.ubicacion}</p>
                                            <p className="text-gray-700 font-bold mt-2">{`$${job.salario}`}</p>
                                            <p className="text-gray-400 text-sm mt-1">{new Date(job.fechaPublicacion).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron ofertas de trabajo</p>
                                )}
                            </div>

                            {/* Detalles del Trabajo */}
                            <div className="md:w-2/3 p-8 bg-white rounded-lg shadow-md max-h-[520px] overflow-y-auto">
                                {selectedJob ? (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-4">{selectedJob.titulo}</h2>
                                        <p className="text-lg text-gray-600 mb-4">{selectedJob.descripcion}</p>
                                        <p className="text-lg text-gray-600 mb-4">{selectedJob.ubicacion}</p>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full">Postularme</button>
                                        </div>
                                        <p className="text-lg font-bold mb-4">{`$${selectedJob.salario}`}</p>
                                        <p className="text-gray-600 mb-2">Contrato por tiempo indeterminado</p>
                                        <p className="text-gray-600 mb-2">Tiempo Completo</p>
                                        <p className="text-gray-600 mb-2">Presencial</p>
                                        <div className="text-gray-600 mt-4">{selectedJob.descripcion}</div>
                                    </div>
                                ) : (
                                    <div className="text-gray-600">Selecciona un trabajo para ver los detalles</div>
                                )}
                            </div>
                        </div>

                    </section>
                </main>
            </div>
        </Layout>
    );
}
