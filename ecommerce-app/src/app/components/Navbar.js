"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HomeIcon, ChartPieIcon, CubeIcon, CogIcon, MoonIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Navbar({ userId, empresaId, rolId }) {
    const [username, setUsername] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const currentPath = router.asPath; // Usamos asPath para obtener la ruta completa con parámetros dinámicos

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
                <Image src="/images/Matchify_logo.png" alt="Matchify Logo" width={110} height={110} />
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-8 text-gray-600">
                <Link href={`/home/user/${userId}/${empresaId}/${rolId}`}>
                    <span
                        className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${
                            currentPath === `/home/user/${userId}/${empresaId}/${rolId}`
                                ? "text-blue-600 border-b-4 border-blue-600 pb-2"
                                : ""
                        }`}
                    >
                        <HomeIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </span>
                </Link>

                <Link href="/analytics">
                    <span
                        className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${
                            currentPath === "/analytics" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""
                        }`}
                    >
                        <ChartPieIcon className="h-5 w-5 text-gray-600" />
                        <span>Analytics</span>
                    </span>
                </Link>

                <Link href="/products">
                    <span
                        className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${
                            currentPath === "/products" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""
                        }`}
                    >
                        <CubeIcon className="h-5 w-5 text-gray-600" />
                        <span>Products</span>
                    </span>
                </Link>

                <Link href="/settings">
                    <span
                        className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${
                            currentPath === "/settings" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""
                        }`}
                    >
                        <CogIcon className="h-5 w-5 text-gray-600" />
                        <span>Settings</span>
                    </span>
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
                            <Link href={`/home/user/${userId}/edit`}>
                                <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    Edit Profile
                                </span>
                            </Link>
                            <span
                                onClick={handleLogout}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                Logout
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
