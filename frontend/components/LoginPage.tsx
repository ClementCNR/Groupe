'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { LoginRequest } from '@/types/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const credentials: LoginRequest = { email, password };
            const response = await authService.login(credentials);
            authService.setAuthData(response);
            router.push('/dashboard');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Erreur de connexion. Veuillez réessayer.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Système de Parking
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 p-3 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full mb-4 p-3 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>

                {error && (
                    <p className="text-red-600 text-center mt-4 text-sm">{error}</p>
                )}
            </form>
        </div>
    );
} 