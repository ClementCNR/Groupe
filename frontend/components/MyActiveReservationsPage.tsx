'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useReservation } from '@/hooks/useReservation';
import Navbar from '@/components/Navbar';

export default function MyActiveReservationsPage() {
  const router = useRouter();
  const user = authService.getUser();
  const { reservations, loading, error, loadReservations, cancelReservation, checkIn, userRole } = useReservation();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      loadReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCancel = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await cancelReservation(id);
        alert('Réservation annulée avec succès');
      } catch (err) {
        alert('Erreur lors de l\'annulation');
      }
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
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
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
                      {reservation.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleCheckIn(reservation.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Check-in
                          </button>
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Annuler
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
} 