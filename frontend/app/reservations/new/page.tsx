import { Suspense } from 'react';
import NewReservationPage from '@/components/NewReservationPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NewReservationPage />
    </Suspense>
  );
} 