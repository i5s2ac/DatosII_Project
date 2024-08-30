import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OffersList() {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            const res = await fetch('/api/ofertas');
            const data = await res.json();

            if (data.success) {
                setOffers(data.ofertas);
            } else {
                console.error('Error fetching job offers');
            }
        };

        fetchOffers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta oferta?');

        if (confirmDelete) {
            const res = await fetch(`/api/ofertas/${id}/delete`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setOffers(offers.filter((offer) => offer.id !== id));
            } else {
                console.error('Error deleting job offer');
            }
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Ofertas de Empleo</h1>
            <ul className="space-y-4">
                {offers.map((offer) => (
                    <li key={offer.id} className="border border-gray-300 rounded-md p-4">
                        <h2 className="text-xl font-bold">{offer.titulo}</h2>
                        <p>{offer.descripcion}</p>
                        <p><strong>Ubicación:</strong> {offer.ubicacion}</p>
                        <p><strong>Salario:</strong> {offer.salario}</p>
                        <p><strong>Publicado:</strong> {offer.fechaPublicacion}</p>
                        <p><strong>Cierre:</strong> {offer.fechaCierre}</p>
                        <div className="flex space-x-4 mt-4">
                            <Link href={`/offers/edit/${offer.id}`}>
                                <a className="text-blue-500">Editar</a>
                            </Link>
                            <button
                                className="text-red-500"
                                onClick={() => handleDelete(offer.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
