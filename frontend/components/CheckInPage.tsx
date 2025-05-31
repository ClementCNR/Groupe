'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { useReservation } from '@/hooks/useReservation';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { 
    reservations, 
    loading, 
    error, 
    loadReservations, 
    checkIn,
    checkInBySecretary,
    userRole 
  } = useReservation();
  
  const [selectedReservation, setSelectedReservation] = useState<string>('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInError, setCheckInError] = useState('');
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const u = authService.getUser();
    if (!u) {
      router.push('/login');
    } else {
      setCurrentUser(u);
    }
  }, [router]);
  useEffect(() => {
    if (currentUser) {
      loadReservations();
    }
  }, [currentUser, loadReservations]);
  useEffect(() => { setIsClient(true); }, []);

  const todayReservations = reservations.filter(reservation => {
    const today = new Date().toISOString().split('T')[0];
    return String(reservation.status) === 'RESERVED' && 
           new Date(reservation.startDate) <= new Date(today) &&
           new Date(reservation.endDate) >= new Date(today);
  });

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInLoading(true);
    setCheckInError('');
    setCheckInSuccess(false);
    try {
      if (!selectedReservation) throw new Error('Veuillez sélectionner une réservation');
      
      const selectedRes = todayReservations.find(r => r.id === Number(selectedReservation));
      if (!selectedRes) throw new Error('Réservation non trouvée');

      if (userRole === 'SECRETARY') {
        await checkInBySecretary(Number(selectedReservation), selectedRes.userId.toString());
      } else {
        await checkIn(Number(selectedReservation));
      }
      
      setCheckInSuccess(true);
      toast.success('Check-in effectué avec succès !');
      router.push('/reservations/my-active');
    } catch (err: any) {
      setCheckInError(err.message || 'Erreur lors du check-in');
    } finally {
      setCheckInLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Check-in Parking</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <form onSubmit={handleCheckIn} className="space-y-6">
            {/* Sélection de la réservation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez votre réservation d&apos;aujourd&apos;hui
              </label>
              {loading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : todayReservations.length === 0 ? (
                <p className="text-gray-500">Aucune réservation active aujourd&apos;hui</p>
              ) : (
                <select
                  value={selectedReservation}
                  onChange={(e) => setSelectedReservation(e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={checkInLoading || checkInSuccess}
                >
                  <option value="">Sélectionnez une réservation</option>
                  {todayReservations.map((reservation) => (
                    <option key={reservation.id} value={reservation.id}>
                      Place {reservation.parkingSpotId} - {reservation.startDate.slice(0, 10)} au {reservation.endDate.slice(0, 10)}
                      {userRole === 'SECRETARY' && ` - Utilisateur: ${reservation.userId}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Messages */}
            {checkInError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{checkInError}</p>
              </div>
            )}
            
            {checkInSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">Check-in effectué avec succès ! Redirection...</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={checkInLoading || !selectedReservation || checkInSuccess}
                className={`flex-1 py-3 px-4 rounded-md text-white ${
                  checkInLoading || !selectedReservation || checkInSuccess
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {checkInLoading ? 'Check-in en cours...' : 'Confirmer ma présence'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="font-semibold text-yellow-800 mb-2">Important</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Le check-in doit être effectué avant 11h00</li>
            <li>• Après 11h00, votre place sera libérée automatiquement</li>
            <li>• Scannez le QR code sur votre place pour un check-in rapide</li>
          </ul>
        </div>
      </main>
      <ToastContainer position="top-center" />
    </div>
  );
} 