import { Suspense } from 'react';
import CheckInPage from '@/components/CheckInPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CheckInPage />
    </Suspense>
  );
} 