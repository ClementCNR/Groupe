'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';
import Navbar from '@/components/Navbar';

export default function ManagerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = authService.getUser();
        if (!currentUser) {
            router.push('/login');
        } else if (currentUser.role !== 'MANAGER') {
            router.push('/dashboard');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Tableau de bord Manager</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Nouvelle Réservation */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Nouvelle Réservation</h2>
                        <p className="text-gray-600 mb-4">
                            Réservez une place de parking (max 30 jours)
                        </p>
                        <button 
                            onClick={() => router.push('/reservations/new')}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Faire une réservation
                        </button>
                    </div>
                    
                    {/* Mes Réservations Actives */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">Réservations Actives</h2>
                        <p className="text-gray-600 mb-4">
                            Consultez vos réservations en cours et à venir
                        </p>
                        <button 
                            onClick={() => router.push('/reservations/my-active')}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Voir mes réservations
                        </button>
                    </div>
                    
                    {/* Check-in */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-orange-600">Check-in Parking</h2>
                        <p className="text-gray-600 mb-4">
                            Confirmez votre présence via QR code ou numéro de place
                        </p>
                        <button 
                            onClick={() => router.push('/checkin')}
                            className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                        >
                            Faire un check-in
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Rappel des règles</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Réservation maximum : 30 jours</li>
                        <li>• Check-in obligatoire avant 11h00</li>
                        <li>• Places électriques : rangées A et F uniquement</li>
                        <li>• Les places non confirmées sont libérées après 11h00</li>
                    </ul>
                </div>
            </main>
        </div>
    );
} 