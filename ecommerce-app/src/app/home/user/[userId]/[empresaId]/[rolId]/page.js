"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar({ userId }) {  // Recibe `userId` como prop
    const [username, setUsername] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

            if (data.success) {
                setUsername(data.user.username);
            } else {
                router.push('/auth/login');
            }
        };

        fetchUser();
    }, [userId, router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="p-6 text-white flex justify-between items-center bg-gray-800">
                <div className="flex items-center space-x-4">
                    <Image src="/images/Matchify_logo.png" alt="Matchify Logo" width={40} height={40} />
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
                        <Image src="/images/Profile.jpg" alt="Profile" width={34} height={34} className="rounded-full" />
                        <span className="text-xl">{username}</span>
                        <svg className={`w-5 h-5 transform ${isMenuOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </header>

            <main className="flex-grow bg-white p-6">
                {/* Contenido de la página en blanco */}
            </main>
        </div>
    );
}
