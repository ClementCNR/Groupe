import { Suspense } from 'react';
import MyActiveReservationsPage from '@/components/MyActiveReservationsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <MyActiveReservationsPage />
    </Suspense>
  );
} 