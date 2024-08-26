"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterCompanyPage() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [sitioWeb, setSitioWeb] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formError, setFormError] = useState('');
    const router = useRouter();

    const handleNextStep = () => {
        if (!companyName || !direccion || !telefono || !email || !sitioWeb) {
            setFormError('Please fill out all required fields.');
        } else {
            setFormError('');
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

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
                direccion,
                telefono,
                sitioWeb,
                descripcion,
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
                    {step === 1 && (
                        <div>
                            <h2 className="text-5xl font-bold mb-10 text-gray-800">
                                Register Your<span className="block mt-4">Company</span>
                            </h2>


                            <form className="space-y-6" style={{maxHeight: '340px', overflowY: 'auto'}}>
                            <div>
                                    <label htmlFor="companyName" className="block text-lg font-medium text-gray-700">Company
                                        Name</label>
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
                                    <label htmlFor="direccion"
                                           className="block text-lg font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your company's address"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="telefono"
                                           className="block text-lg font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        id="telefono"
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your company's phone number"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email"
                                           className="block text-lg font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your company's email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sitioWeb"
                                           className="block text-lg font-medium text-gray-700">Website</label>
                                    <input
                                        type="text"
                                        id="sitioWeb"
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your company's website"
                                        value={sitioWeb}
                                        onChange={(e) => setSitioWeb(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="descripcion"
                                           className="block text-lg font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="descripcion"
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter a brief description of your company"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                </div>
                            </form>

                            {formError && (
                                <div className="text-red-600 text-lg mt-6">
                                    {formError}
                                </div>
                            )}

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-5xl font-bold mb-10 text-gray-800">Register your account</h2>
                            <form className="space-y-6" onSubmit={handleRegister}>
                                <div>
                                    <label htmlFor="username"
                                           className="block text-lg font-medium text-gray-700">Username</label>
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

                                {errorMessage && (
                                    <div className="text-red-600 text-lg">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        Back
                                    </button>
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
                    )}
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/Join_Enterprise.png')" }}></div>
        </div>
    );
}
