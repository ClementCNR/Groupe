'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            // Redirection selon le rôle si besoin
            if (user.role === 'EMPLOYEE') router.push('/dashboard/employee');
            else if (user.role === 'SECRETARY') router.push('/dashboard/secretary');
            else if (user.role === 'MANAGER') router.push('/dashboard/manager');
        }
    }, [user]);

    return null; // Pas de contenu ici, on redirige automatiquement
}
