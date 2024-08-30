"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    const router = useRouter();

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

    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = [
        {
            id: 1,
            title: "Analista de soporte IT (Call Center)",
            company: "Importante empresa del sector",
            location: "Nuevo León, Apodaca",
            salary: "$14,000.00 (Mensual)",
            postedTime: "Hace 4 horas",
            description: `
                ¡Estamos Buscando un Analista de Atención de Soporte IT (Call Center)! 
                ¿Te apasiona brindar soporte técnico y atención al cliente? ¡Esta es tu oportunidad! 
                En [Nombre de la Empresa], estamos en la búsqueda de un Analista de Atención de Soporte IT 
                para unirse a nuestro equipo dinámico. ¿Qué Ofrecemos? Seguro de gastos médicos menores y mayores...
            `,
            highlighted: true
        },
        {
            id: 2,
            title: "Gerente Sr. IT",
            company: "ISS Facility Services",
            location: "Estado de México, Naucalpan de Juárez",
            salary: "$75,000.00 (Mensual)",
            postedTime: "Hace 5 horas",
            description: `
                Estamos buscando un Gerente Sr. IT para liderar nuestro equipo de tecnología en ISS Facility Services. 
                En esta posición, serás responsable de manejar las operaciones de TI de la empresa, asegurando la...
            `,
            highlighted: false
        },
        {
            id: 3,
            title: "Trabajo X",
            company: "ISS Facility Services",
            location: "Estado de México, Naucalpan de Juárez",
            salary: "$75,000.00 (Mensual)",
            postedTime: "Hace 5 horas",
            description: `
                Estamos buscando un Gerente Sr. IT para liderar nuestro equipo de tecnología en ISS Facility Services. 
                En esta posición, serás responsable de manejar las operaciones de TI de la empresa, asegurando la...
            `,
            highlighted: false
        }
    ];

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    return (
        <div className="min-h-screen flex flex-col ">
            <nav className="bg-white shadow-lg">
                <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center py-6 px-2">
                            <div className="flex items-center">
                                <Image src="/images/Matchify_logo.png" alt="Logo Picture" width={128} height={128} className="rounded-full" />
                            </div>
                        </a>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative flex items-center space-x-2">
                            <Image src="/images/Profile.jpg" alt="Profile Picture" width={32} height={32} className="rounded-full" />
                            <span className="text-gray-700 text-lg">{username}</span>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                                <Image src="/svg/arrow.svg" alt="Dropdown" width={20} height={20} />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-36 w-48 bg-white border rounded shadow-lg">
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</a>
                                    <a href="#" onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-3" style={{ backgroundColor: '#f6fbff' }}>
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

                        {/* Filtro de Jornada */}
                        <div className="relative">
                            <button
                                className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 flex items-center"
                                onClick={() => setIsWorkdayFilterOpen(!isWorkdayFilterOpen)}
                            >
                                <span className="text-gray-700 font-medium">Jornada</span>
                                <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            {isWorkdayFilterOpen && (
                                <div className="absolute top-12 left-0 w-80 bg-white border rounded-lg shadow-lg p-6 z-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Jornada</h3>
                                        <button onClick={() => setIsWorkdayFilterOpen(false)}>
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <ul>
                                        <li className="flex justify-between items-center py-2">
                                            <span>Tiempo Completo</span>
                                            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-0.5 rounded-full">838</span>
                                        </li>
                                        <li className="flex justify-between items-center py-2">
                                            <span>Por Horas</span>
                                            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-0.5 rounded-full">11</span>
                                        </li>
                                        <li className="flex justify-between items-center py-2">
                                            <span>Medio tiempo</span>
                                            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-0.5 rounded-full">4</span>
                                        </li>
                                        <li className="flex justify-between items-center py-2">
                                            <span>Beca/prácticas</span>
                                            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-0.5 rounded-full">3</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de Trabajos y Detalles */}
                    <div className="flex flex-col md:flex-row min-h-screen">
                        {/* Lista de Trabajos */}
                        <div className="md:w-1/3 px-4 max-h-[540px] overflow-y-auto">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => handleJobClick(job)}
                                    className={`cursor-pointer bg-white rounded-lg shadow-md p-8 mb-8 border-2 ${
                                        selectedJob && selectedJob.id === job.id ? "border-blue-500" : "border-transparent"
                                    }`}
                                >
                                    {job.highlighted && <div className="text-sm text-yellow-600 font-bold">Empleo destacado</div>}
                                    <h3 className="text-lg font-semibold">{job.title}</h3>
                                    <p className="text-gray-600">{job.company}</p>
                                    <p className="text-gray-500">{job.location}</p>
                                    <p className="text-gray-700 font-bold mt-2">{job.salary}</p>
                                    <p className="text-gray-400 text-sm mt-1">{job.postedTime}</p>
                                </div>
                            ))}
                        </div>

                        {/* Detalles del Trabajo */}
                        <div className="md:w-2/3 p-8 bg-white rounded-lg shadow-md max-h-[520px] overflow-y-auto">
                            {selectedJob ? (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">{selectedJob.title}</h2>
                                    <p className="text-lg text-gray-600 mb-4">{selectedJob.company}</p>
                                    <p className="text-lg text-gray-600 mb-4">{selectedJob.location}</p>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full">Postularme</button>
                                        <button className="bg-gray-100 text-blue-600 px-3 py-2 rounded-full">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 16.343l-6.828-6.829a4 4 0 010-5.656z" />
                                            </svg>
                                        </button>
                                        <button className="bg-gray-100 text-blue-600 px-3 py-2 rounded-full">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M15 8a3 3 0 01-2.94 2.998L12 11v1.382l3.293 3.293-1.414 1.414L10 13.414V11l-1.29-.002A3 3 0 117 8a3 3 0 013-3h2a3 3 0 013 3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button className="bg-gray-100 text-blue-600 px-3 py-2 rounded-full">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a1 1 0 00-1 1v10a1 1 0 001 1h5v2H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2h5a1 1 0 001-1V4a1 1 0 00-1-1H4z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-lg font-bold mb-4">{selectedJob.salary}</p>
                                    <p className="text-gray-600 mb-2">Contrato por tiempo indeterminado</p>
                                    <p className="text-gray-600 mb-2">Tiempo Completo</p>
                                    <p className="text-gray-600 mb-2">Presencial</p>
                                    <div className="text-gray-600 mt-4">{selectedJob.description}</div>
                                </div>
                            ) : (
                                <div className="text-gray-600">Selecciona un trabajo para ver los detalles</div>
                            )}
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}
