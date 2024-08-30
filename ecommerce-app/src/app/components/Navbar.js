"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar({ userId, empresaId, rolId }) {  // Recibe `userId`, `empresaId` y `rolId` como props
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
            <header className="p-6 text-white flex justify-between items-center bg-white">
                <div className="flex items-center space-x-4">
                    <Image src="/images/Matchify_logo.png" alt="Matchify Logo" width={128} height={128}/>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="relative flex items-center space-x-2">
                        <Image src="/images/Profile.jpg" alt="Profile Picture" width={32} height={32}
                               className="rounded-full"/>
                        <span className="text-gray-700 text-lg">{username}</span>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                            <Image src="/svg/arrow.svg" alt="Dropdown" width={20} height={20}/>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-36 w-48 bg-white border rounded shadow-lg">
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</a>
                                <a href="#" onClick={handleLogout}
                                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>


    );
}
