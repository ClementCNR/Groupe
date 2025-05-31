import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Dashboard />
    </Suspense>
  );
} 