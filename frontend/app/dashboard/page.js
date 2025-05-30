"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null; // Empêche le flicker

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard</h1>
                <p className="mt-4">Bienvenue, {user.email} !</p>

                {user.role === 'ADMIN' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Espace Admin</h2>
                        <p className="text-gray-600">Vous pouvez gérer les utilisateurs et superviser la plateforme.</p>
                        {/* Boutons ou liens vers les fonctionnalités Admin */}
                    </div>
                )}

                {user.role === 'MANAGER' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Espace Manager</h2>
                        <p className="text-gray-600">Vous pouvez gérer les réservations et suivre les performances.</p>
                        {/* Liens spécifiques Manager */}
                    </div>
                )}

                {user.role === 'USER' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Espace Utilisateur</h2>
                        <p className="text-gray-600">Vous pouvez consulter vos réservations et effectuer de nouvelles réservations.</p>
                        {/* Liens vers réservations */}
                    </div>
                )}

                {/* Section universelle (si besoin) */}
                <div className="mt-8">
                    <p className="text-sm text-gray-500">Dernière connexion : {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
