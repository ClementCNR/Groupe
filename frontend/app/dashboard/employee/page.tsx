import { Suspense } from 'react';
import EmployeeDashboard from '@/components/EmployeeDashboard';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EmployeeDashboard />
    </Suspense>
  );
} 