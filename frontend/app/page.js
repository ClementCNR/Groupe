'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const user = authService.getUser();
        if (!user) {
            router.push('/login');
        } else {
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
        }
    }, [router]); 

    return null; // Pas de contenu ici, on redirige automatiquement
}
