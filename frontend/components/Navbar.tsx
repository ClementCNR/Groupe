'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(authService.getUser());
    }, []);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    const getRoleLabel = (role: string): string => {
        switch (role) {
            case 'MANAGER': return 'Manager';
            case 'EMPLOYEE': return 'Employé';
            case 'SECRETARY': return 'Secrétaire';
            default: return role;
        }
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-xl font-bold hover:underline focus:outline-none"
                            aria-label="Retour au dashboard"
                            type="button"
                        >
                            Système de Parking
                        </button>
                        {user && (
                            <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                                {getRoleLabel(user.role)}
                            </span>
                        )}
                    </div>
                    
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">
                                {user.firstName} {user.lastName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
                            >
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
} 