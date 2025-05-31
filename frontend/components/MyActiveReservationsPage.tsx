'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useReservation } from '@/hooks/useReservation';
import { reservationService } from '@/services/reservation';
import { ParkingSpot, ReservationStatus } from '@/types/reservation';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyActiveReservationsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const { 
    reservations, 
    loading, 
    error, 
    loadReservations, 
    cancelReservation, 
    cancelReservationBySecretary,
    checkIn, 
    userRole,
    updateReservation
  } = useReservation();
  const [cancellingId, setCancellingId] = React.useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [reservationToCancel, setReservationToCancel] = React.useState<number | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [reservationToEdit, setReservationToEdit] = React.useState<any>(null);
  const [editFormData, setEditFormData] = React.useState({
    startDate: '',
    endDate: '',
    parkingSpotId: '',
    status: ''
  });
  const [parkingSpots, setParkingSpots] = React.useState<ParkingSpot[]>([]);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      router.push('/login');
    } else {
      loadReservations();
      loadParkingSpots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getAvailableParkingSpots = () => {
    // Si on est en train de modifier une réservation, on inclut sa place actuelle
    const currentReservationSpot = reservationToEdit?.parkingSpotId;
    
    // On récupère toutes les places réservées pour la période sélectionnée
    const reservedSpots = reservations
      .filter(res => 
        res.id !== reservationToEdit?.id && // Exclure la réservation en cours de modification
        res.status === 'RESERVED' as ReservationStatus && // Seulement les réservations actives
        // Vérifier si la période se chevauche
        (new Date(res.startDate) <= new Date(editFormData.endDate) &&
         new Date(res.endDate) >= new Date(editFormData.startDate))
      )
      .map(res => res.parkingSpotId);

    // Filtrer les places de parking
    return parkingSpots.filter(spot => 
      // Inclure la place actuelle de la réservation en cours de modification
      spot.id === currentReservationSpot ||
      // Ou inclure les places non réservées
      !reservedSpots.includes(spot.id)
    );
  };

  const loadParkingSpots = async () => {
    try {
      const spots = await reservationService.getParkingSpots();
      setParkingSpots(spots);
    } catch (err) {
      toast.error('Erreur lors du chargement des places de parking');
    }
  };

  const handleCancel = (id: number) => {
    setReservationToCancel(id);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    if (!reservationToCancel) return;
    setCancellingId(reservationToCancel);
    setShowConfirmModal(false);
    try {
      if (userRole === 'SECRETARY') {
        const res = reservations.find(r => r.id === reservationToCancel);
        if (res && res.userId) {
          await cancelReservationBySecretary(reservationToCancel, res.userId.toString());
        }
      } else {
        await cancelReservation(reservationToCancel);
      }
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

  const handleEdit = (reservation: any) => {
    setReservationToEdit(reservation);
    setEditFormData({
      startDate: reservation.startDate.slice(0, 10),
      endDate: reservation.endDate.slice(0, 10),
      parkingSpotId: reservation.parkingSpotId,
      status: reservation.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(editFormData.startDate);
      const endDate = new Date(editFormData.endDate);

      if (startDate < today) {
        toast.error('La date de début doit être aujourd\'hui ou plus tard');
        return;
      }

      if (endDate < startDate) {
        toast.error('La date de fin doit être après la date de début');
        return;
      }

      await updateReservation(reservationToEdit.id, editFormData);
      toast.success('Réservation modifiée avec succès');
      setShowEditModal(false);
      loadReservations();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la modification');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      RESERVED: 'bg-green-100 text-green-800',
      CHECKED_IN: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800'
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
                      {userRole === 'SECRETARY' && (
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-150 shadow-sm mr-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>
                      )}
                      {['RESERVED'].includes(reservation.status) && (
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
      {/* Modal de modification */}
      {showEditModal && reservationToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Modifier la réservation</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={editFormData.endDate}
                  onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place de parking
                </label>
                <select
                  value={editFormData.parkingSpotId}
                  onChange={(e) => setEditFormData({...editFormData, parkingSpotId: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionnez une place</option>
                  {getAvailableParkingSpots().map((spot) => (
                    <option 
                      key={spot.id} 
                      value={spot.id}
                    >
                      Rangée {spot.row} - Place {spot.number.toString().padStart(2, '0')}
                      {spot.hasCharger ? ' (Électrique)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Les places électriques sont disponibles dans les rangées A et F
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="RESERVED">Réservée</option>
                  <option value="CHECKED_IN">Check-in effectué</option>
                  <option value="CANCELLED">Annulée</option>
                  <option value="EXPIRED">Expirée</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 