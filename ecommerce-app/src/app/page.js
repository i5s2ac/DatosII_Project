"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/auth/login");
    };

    const handleRegisterClick = () => {
        router.push("/auth/register");
    };

    return (
        <div className="relative min-h-screen flex">
            {/* Left half with white background and text */}
            <div className="w-1/2 bg-white flex flex-col justify-between text-black">


                <main className="flex-grow flex flex-col justify-center items-start px-8 md:px-16 lg:px-32">
                    <div className="max-w-lg">
                        <h1 className="text-4xl font-bold text-gray-800 mb-12">TechStore</h1>
                        <h2 className="text-5xl font-extrabold mb-4 leading-tight text-gray-800">
                            Welcome to the best tech store in LATAM
                        </h2>
                        <p className="text-lg text-gray-600 mb-12">
                            Discover the latest technology at unbeatable prices.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleRegisterClick}
                                className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={handleLoginClick}
                                className="px-6 py-3 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition duration-300"
                            >
                                Log in into my account
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-4 text-center text-gray-500">
                    &copy; 2024 TechStore. All rights reserved.
                </footer>
            </div>

            {/* Right half with background image */}
            <div
                className="w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/Cover.png')", // Replace with your image path
                }}
            ></div>
        </div>
    );
}
