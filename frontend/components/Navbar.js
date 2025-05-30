'use client';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="font-bold text-lg">Parking App</h1>
            <div className="flex space-x-4">
                {user?.role === 'SECRETARY' && (
                    <button className="bg-white text-blue-600 px-2 py-1 rounded">
                        Administration
                    </button>
                )}
                <button onClick={logout} className="bg-white text-blue-600 px-2 py-1 rounded">
                    Se déconnecter
                </button>
            </div>
        </nav>
    );
}
