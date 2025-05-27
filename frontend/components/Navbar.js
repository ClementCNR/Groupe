"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        // 🚧 Simulation du rôle (à remplacer par une vraie auth plus tard)
        // Change ici pour tester : "employee", "manager", "secretary"
        setRole("employee");
    }, []);

    return (
        <nav className="bg-gray-800 text-white p-4 flex gap-4">
            <Link href="/" className="hover:text-gray-300">Accueil</Link>

            {role === "employee" && (
                <Link href="/reservations" className="hover:text-gray-300">Réserver</Link>
            )}

            {role === "manager" && (
                <>
                    <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <Link href="/reservations" className="hover:text-gray-300">Réserver</Link>
                </>
            )}

            {role === "secretary" && (
                <Link href="/admin" className="hover:text-gray-300">Admin</Link>
            )}

            <Link href="/login" className="hover:text-gray-300">Login</Link>
        </nav>
    );
}
