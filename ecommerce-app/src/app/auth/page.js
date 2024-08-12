"use client"; // Asegúrate de tener esta línea al inicio

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Cambia a 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Esto evita que la página se recargue al enviar el formulario

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await res.json();

        if (data.success) {
            router.push('/');
        } else {
            setErrorMessage('Login failed, please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Parte izquierda con fondo blanco */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-16">
                <div className="w-full max-w-md">
                    <h2 className="text-5xl font-bold mb-10 text-gray-800">Welcome back!</h2>
                    <p className="text-xl text-gray-600 mb-8">Enter your email address and password to access your account.</p>

                    {/* El formulario debe tener onSubmit apuntando a handleSubmit */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mensaje de error */}
                        {errorMessage && (
                            <div className="text-red-600 text-lg">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember_me"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-lg text-gray-900">Remember me</label>
                            </div>

                            <div className="text-lg">
                                <a href="#" className="font-medium text-primary hover:text-secondary">Forgot your password?</a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit" // Asegúrate de que este botón tenga type="submit"
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Log In
                            </button>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-lg text-gray-700">Don't have an account? <a href="#" className="text-primary font-medium hover:text-secondary">Register here.</a></p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Parte derecha con la imagen de fondo */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/MousePad.jpg')" }}></div>
        </div>
    );
}
