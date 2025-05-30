"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard</h1>
                <p className="mt-4">Bienvenue, {user.firstName} {user.lastName} ({user.email})</p>
                <p className="text-gray-600">Votre rôle : {user.role}</p>

                {/* Espace Admin */}
                {user.role === 'ADMIN' && (
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h2 className="text-xl font-semibold">Espace Admin</h2>
                        <p className="text-gray-600 mb-4">Gérez les utilisateurs et supervisez la plateforme.</p>
                        <button onClick={() => router.push('/admin/users')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4">Gérer les Utilisateurs</button>
                        <button onClick={() => router.push('/admin/dashboard')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Voir le Dashboard Admin</button>
                    </div>
                )}

                {/* Espace Manager */}
                {user.role === 'MANAGER' && (
                    <div className="mt-6 p-4 bg-black-100 rounded">
                        <h2 className="text-xl font-semibold">Espace Manager</h2>
                        <p className="text-gray-600 mb-4">Visualisez les statistiques.</p>
                        <button onClick={() => router.push('/manager/stats')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4">Voir les Statistiques</button>
                        <button onClick={() => router.push('/reservations')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Réserver une Place</button>
                        <button onClick={() => router.push('/user/reservations')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-4">Voir mes Réservations</button>
                    </div>
                )}

                {/* Espace Utilisateur */}
                {user.role === 'USER' && (
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h2 className="text-xl font-semibold">Espace Utilisateur</h2>
                        <p className="text-gray-600 mb-4">Gérez vos réservations et réservez une place.</p>
                        <button onClick={() => router.push('/reservations')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4">Nouvelle Réservation</button>
                        <button onClick={() => router.push('/user/reservations')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Voir mes Réservations</button>
                    </div>
                )}

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}
