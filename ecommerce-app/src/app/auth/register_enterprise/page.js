"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterCompanyPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [sector, setSector] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                phone,
                companyName,
                sector,
                location,
                description,
            }),
        });

        const data = await res.json();

        if (data.success) {
            router.push('/auth/login'); // Redirect to the login page after successful registration
        } else {
            setErrorMessage(data.message || 'Registration failed, please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-16">
                <div className="w-full max-w-md">
                    <h2 className="text-5xl font-bold mb-10 text-gray-800">Register your company</h2>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

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

                        <div>
                            <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-lg font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your company name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="sector" className="block text-lg font-medium text-gray-700">Sector</label>
                            <input
                                type="text"
                                id="sector"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your company's sector"
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-lg font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                id="location"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your company's location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter a brief description of your company"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 text-lg">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Register
                            </button>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-lg text-gray-700">Already have an account? <a href="/auth/login" className="text-primary font-medium hover:text-secondary">Log in here.</a></p>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/MousePad.jpg')" }}></div>
        </div>
    );
}