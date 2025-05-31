import { Suspense } from 'react';
import SecretaryDashboard from '@/components/SecretaryDashboard';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SecretaryDashboard />
    </Suspense>
  );
} 