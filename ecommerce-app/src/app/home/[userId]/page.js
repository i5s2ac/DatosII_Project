"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserPage({ params }) {
    const [products, setProducts] = useState([]);
    const [username, setUsername] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const userId = params.userId;

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`/api/products?userId=${userId}`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        };

        const fetchUser = async () => {
            const res = await fetch(`/api/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsername(data.user.username);
            } else {
                router.push('/auth/login');
            }
        };

        fetchProducts();
        fetchUser();
    }, [router, userId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="relative bg-cover bg-center text-white h-[50vh]" style={{ backgroundImage: "url('/images/MousePad.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 max-w-8xl mx-auto flex justify-between items-center p-6">
                    <h1 className="text-2xl font-bold text-left">TechStore</h1>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
                            <Image src="/images/Profile.jpg" alt="Profile" width={34} height={34} className="rounded-full" />
                            <span className="text-xl">{username}</span>
                            <svg className={`w-5 h-5 transform ${isMenuOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-grow p-6">
                <section className="my-8">
                    <h2 className="text-3xl font-semibold mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <div key={product.id} className="border rounded-lg shadow-lg hover:shadow-custom-dark transition duration-300 overflow-hidden">
                                <div className="relative w-full h-64">
                                    <Image src={product.imageUrl} alt={product.title} layout="fill" objectFit="cover" className="w-full h-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold">{product.title}</h3>
                                    <p className="mt-2 text-gray-600">{product.description}</p>
                                    <p className="mt-2 font-bold text-lg">{product.price}</p>
                                    <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition duration-300">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
