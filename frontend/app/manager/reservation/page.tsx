'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function ManagerReservationPage() {
  const router = useRouter();
  const user = authService.getUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'MANAGER') {
      router.push('/dashboard');
    } else {
      router.push('/reservations/new');
    }
  }, [user, router]);

  return null;
} 