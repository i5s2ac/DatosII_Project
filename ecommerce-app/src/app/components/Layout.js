// components/Layout.js
"use client";

import Navbar from './Navbar';

export default function Layout({ children, userId, empresaId, rolId }) {
    return (
        <div className="min-h-screen flex flex-col">
            {empresaId && rolId ? (
                // Layout para usuario empresa
                <Navbar userId={userId} empresaId={empresaId} rolId={rolId} />
            ) : (
                // Layout para usuario normal
                <Navbar userId={userId} />
            )}
            <main className="flex-grow bg-white p-6">
                {children}
            </main>
        </div>
    );
}
