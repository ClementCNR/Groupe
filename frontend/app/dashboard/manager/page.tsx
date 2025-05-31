import { Suspense } from 'react';
import ManagerDashboard from '@/components/ManagerDashboard';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ManagerDashboard />
    </Suspense>
  );
} 