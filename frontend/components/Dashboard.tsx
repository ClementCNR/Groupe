'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const user = authService.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // Redirection basée sur le rôle
        switch (user.role) {
            case 'EMPLOYEE':
                router.push('/dashboard/employee');
                break;
            case 'SECRETARY':
                router.push('/dashboard/secretary');
                break;
            case 'MANAGER':
                router.push('/dashboard/manager');
                break;
            default:
                router.push('/login');
        }
    }, [router]);

    // Page de chargement pendant la redirection
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl">Redirection en cours...</div>
        </div>
    );
} 