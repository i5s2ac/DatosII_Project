"use client";  // Esto marca el archivo como un componente del cliente

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the API
        const fetchProducts = async () => {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col">
            <header className="relative bg-cover bg-center text-white h-[50vh]" style={{ backgroundImage: "url('/images/MousePad.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 max-w-8xl mx-auto flex justify-between items-center p-6">
                    <h1 className="text-2xl font-bold text-left">TechStore</h1>

                </div>
                <div className="relative z-10 max-w-7xl mx-auto text-center py-20">
                    <h2 className="text-6xl font-bold mb-7 text-center">Welcome To Our Online Store</h2>
                    <p className="text-xl mb-7 text-center text-gray-300">Discover the latest in technology at unbeatable prices.
                        Whether you&apos;re looking for the newest gadgets, top-of-the-line laptops, or must-have
                        accessories, we&apos;ve got you covered. Shop with us and stay ahead of the tech curve.</p>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search products"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="flex-grow px-6 py-4 mb-4 md:mb-0 md:mr-2 rounded-lg border border-gray-300 text-black"
                        />
                        <button
                            className="bg-primary text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition duration-300">
                            Search
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black"></div>
            </header>

            <main className="flex-grow p-6">
                <section className="my-8">
                    <h2 className="text-3xl font-semibold mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                title={product.title}
                                description={product.description}
                                imageUrl={product.imageUrl}
                                price={product.price}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white p-4 mt-8">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; 2024 TechStore App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function ProductCard({ title, description, imageUrl, price }) {
    return (
        <div className="border rounded-lg shadow-lg hover:shadow-custom-dark transition duration-300 overflow-hidden">
            <div className="relative w-full h-64">
                <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="w-full h-full" />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-gray-600">{description}</p>
                <p className="mt-2 font-bold text-lg">{price}</p>
                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition duration-300">Add to Cart</button>
            </div>
        </div>
    );
}
