import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditOffer() {
    const router = useRouter();
    const { id } = router.query;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        salario: '',
        fechaPublicacion: '',
        fechaCierre: '',
    });

    useEffect(() => {
        const fetchOffer = async () => {
            const res = await fetch(`/api/ofertas/${id}`);
            const data = await res.json();

            if (data.success) {
                setFormData(data.oferta);
            } else {
                console.error('Error fetching job offer');
            }
        };

        if (id) {
            fetchOffer();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/ofertas/${id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/offers');
        } else {
            console.error('Error updating job offer');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Editar Oferta de Empleo</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion"
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        id="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="salario" className="block text-sm font-medium text-gray-700">Salario</label>
                    <input
                        type="number"
                        name="salario"
                        id="salario"
                        value={formData.salario}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                    <input
                        type="date"
                        name="fechaPublicacion"
                        id="fechaPublicacion"
                        value={formData.fechaPublicacion}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="fechaCierre" className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
                    <input
                        type="date"
                        name="fechaCierre"
                        id="fechaCierre"
                        value={formData.fechaCierre}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Actualizar Oferta
                    </button>
                </div>
            </form>
        </div>
    );
}
