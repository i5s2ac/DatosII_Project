"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Importamos los iconos de Heroicons v2
import { HomeIcon, ChartPieIcon, CubeIcon, CogIcon, MoonIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Navbar({ userId }) {
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
        <header className="flex justify-between border border-gray-200 items-center px-6 py-4 bg-white shadow-sm">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center">

                    <Image src="/images/Matchify_logo.png" alt="Matchify Logo" width={110} height={110} />                </div>
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-8 text-gray-600">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <HomeIcon className="h-5 w-5 text-gray-600" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/analytics" className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <ChartPieIcon className="h-5 w-5 text-gray-600" />
                    <span>Analytics</span>
                    <span className="ml-1">▾</span>
                </Link>
                <Link href="/products" className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <CubeIcon className="h-5 w-5 text-gray-600" />
                    <span>Products</span>
                    <span className="ml-1">▾</span>
                </Link>
                <Link href="/settings" className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <CogIcon className="h-5 w-5 text-gray-600" />
                    <span>Settings</span>
                </Link>
            </nav>

            {/* Íconos de acciones y menú del usuario */}
            <div className="flex items-center space-x-6">
                <button className="hover:text-blue-600 transition">
                    <MoonIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button className="relative hover:text-blue-600 transition">
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    <span className="absolute top-0 right-0 block h-2 w-2 bg-orange-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 focus:outline-none">
                        <Image
                            src="/images/Profile.jpg"
                            alt="User Profile"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <span className="text-gray-800">{username}</span>
                        <Image src="/svg/arrow.svg" alt="Dropdown" width={20} height={20} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <Link href={`/home/user/${userId}/edit`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                Edit Profile
                            </Link>
                            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
