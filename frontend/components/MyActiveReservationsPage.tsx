'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useReservation } from '@/hooks/useReservation';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyActiveReservationsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const { reservations, loading, error, loadReservations, cancelReservation, checkIn, userRole } = useReservation();
  const [cancellingId, setCancellingId] = React.useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [reservationToCancel, setReservationToCancel] = React.useState<number | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      router.push('/login');
    } else {
      loadReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancel = (id: number) => {
    setReservationToCancel(id);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    if (!reservationToCancel) return;
    setCancellingId(reservationToCancel);
    setShowConfirmModal(false);
    try {
      await cancelReservation(reservationToCancel);
      toast.success('Réservation annulée avec succès');
      loadReservations();
    } catch (err) {
      toast.error('Erreur lors de l\'annulation');
    } finally {
      setCancellingId(null);
      setReservationToCancel(null);
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await checkIn(id);
      alert('Check-in effectué avec succès');
    } catch (err) {
      alert('Erreur lors du check-in');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      NO_SHOW: 'bg-orange-100 text-orange-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (user === null) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {userRole === 'SECRETARY' ? 'Toutes les réservations' : 'Mes réservations actives'}
          </h1>
          <button
            onClick={() => router.push('/reservations/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nouvelle réservation
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des réservations...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && reservations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Aucune réservation active</p>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  {userRole === 'SECRETARY' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.parkingSpotId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.startDate.slice(0, 10)} - {reservation.endDate.slice(0, 10)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    {userRole === 'SECRETARY' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.userId}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {['PENDING', 'RESERVED'].includes(reservation.status) && (
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed`}
                          disabled={cancellingId === reservation.id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <ToastContainer position="top-center" />
      {/* Modal de confirmation d'annulation */}
      {showConfirmModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Annuler la réservation ?</h2>
            <p className="mb-6 text-gray-700">Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
              >
                Retour
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold shadow"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 