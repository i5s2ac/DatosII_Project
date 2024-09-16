"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Layout from '../../../components/Layout';

export default function UserPage({ params }) {
    const { userId } = params;
    const [username, setUsername] = useState('');
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
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const router = useRouter();

    // Verificar usuario y obtener datos del usuario
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
                    setJobs(data.ofertas || []);
                } else {
                    console.error('Error al obtener ofertas:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener ofertas:', error);
            }
        };

        fetchJobs();
    }, [userId]);

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
                <main className="flex-grow p-6 bg-gray-50">
                    <section className="my-8">

                        {/* Barra de búsqueda */}
                        <div className="flex justify-between items-center mb-8">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Busca trabajos, empresas..."
                                className="w-full px-6 py-3 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full focus:outline-none transition duration-200"
                            >
                                <Image src="/svg/lupa.svg" alt="Search" width={24} height={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Filtros */}
                            <div className="col-span-12 md:col-span-3 bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-4">Filter by</h2>

                                {/* Filtros detallados */}
                                <div className="space-y-4">
                                    {/* Tipo de Trabajo */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Job Type</label>
                                        <select
                                            name="workday"
                                            value={filters.workday}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Freelance">Freelance</option>
                                        </select>
                                    </div>

                                    {/* Rango salarial */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Salary Range</label>
                                        <select
                                            name="salary"
                                            value={filters.salary}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="0-1000">$0 - $1,000</option>
                                            <option value="1000-5000">$1,000 - $5,000</option>
                                            <option value="5000-10000">$5,000 - $10,000</option>
                                        </select>
                                    </div>

                                    {/* Experiencia */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Experience</label>
                                        <select
                                            name="experience"
                                            value={filters.experience}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="1-2">1-2 Years</option>
                                            <option value="3-5">3-5 Years</option>
                                            <option value="5-10">5-10 Years</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de trabajos */}
                            <div className="col-span-12 md:col-span-5 bg-white rounded-lg shadow-md p-6 max-h-[520px] overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-4">Job List</h2>
                                {jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => handleJobClick(job)}
                                            className={`cursor-pointer bg-gray-50 rounded-lg shadow-sm p-6 mb-4 hover:shadow-md border ${
                                                selectedJob && selectedJob.id === job.id ? "border-blue-500" : "border-gray-200"
                                            } transition`}
                                        >
                                            <div className="flex items-center mb-3">
                                                <Image src="/svg/company-icon.svg" alt="Company Logo" width={40} height={40} />
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold">{job.titulo}</h3>
                                                    <p className="text-gray-500">{job.ubicacion}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{job.descripcion}</p>
                                            <p className="text-gray-700 font-bold mt-2">{`$${job.salario}`}</p>
                                            <p className="text-gray-400 text-sm mt-1">{new Date(job.fechaPublicacion).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron ofertas de trabajo</p>
                                )}
                            </div>

                            {/* Detalles del trabajo */}
                            <div className="col-span-12 md:col-span-4 bg-white rounded-lg shadow-md p-6 max-h-[520px] overflow-y-auto">
                                {selectedJob ? (
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <Image src="/svg/company-icon.svg" alt="Company Logo" width={50} height={50} />
                                            <h2 className="text-2xl font-semibold ml-4">{selectedJob.titulo}</h2>
                                        </div>
                                        <p className="text-lg text-gray-600 mb-4">{selectedJob.descripcion}</p>
                                        <p className="text-lg text-gray-600 mb-4">{selectedJob.ubicacion}</p>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200">Postularme</button>
                                        </div>
                                        <p className="text-lg font-bold mb-4">{`$${selectedJob.salario}`}</p>
                                        <p className="text-gray-600 mb-2">Contract: Permanent</p>
                                        <p className="text-gray-600 mb-2">Full-Time</p>
                                        <p className="text-gray-600 mb-2">On-Site</p>
                                        <div className="text-gray-600 mt-4">{selectedJob.descripcion}</div>
                                    </div>
                                ) : (
                                    <div className="text-gray-600">Select a job to view details</div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </Layout>
    );
}