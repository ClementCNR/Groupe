'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { reservationService } from '@/services/reservation';
import { parkingService } from '@/services/parking';
import { useReservation } from '@/hooks/useReservation';
import Navbar from '@/components/Navbar';

export default function NewReservationPage() {
  const router = useRouter();
  const user = authService.getUser();
  const { maxReservationDays, createReservation, loading, error } = useReservation();
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    requiresElectricity: false,
    parkingSpotId: ''
  });
  
  const [availableSpots, setAvailableSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(false);

  const loadAvailableSpots = useCallback(async () => {
    setLoadingSpots(true);
    try {
      const spots = await parkingService.getAvailableSpots(
        formData.startDate,
        formData.endDate,
        formData.requiresElectricity
      );
      setAvailableSpots(spots);
    } catch (err) {
      console.error('Erreur lors du chargement des places:', err);
    } finally {
      setLoadingSpots(false);
    }
  }, [formData.startDate, formData.endDate, formData.requiresElectricity]);

  // Rediriger si non connecté
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Charger les places disponibles quand les dates changent
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      loadAvailableSpots();
    }
  }, [formData.startDate, formData.endDate, formData.requiresElectricity, loadAvailableSpots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createReservation(formData);
      alert('Réservation créée avec succès !');
      router.push('/reservations/my-active');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const calculateMaxEndDate = () => {
    if (!formData.startDate) return '';
    
    const start = new Date(formData.startDate);
    const maxEnd = new Date(start);
    maxEnd.setDate(maxEnd.getDate() + maxReservationDays - 1);
    
    return maxEnd.toISOString().split('T')[0];
  };

  // Si non connecté, ne rien afficher
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Nouvelle Réservation</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info sur les limites selon le rôle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Durée maximale de réservation :</strong> {maxReservationDays} jours
                {user.role === 'MANAGER' && ' (privilège manager)'}
              </p>
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                min={formData.startDate}
                max={calculateMaxEndDate()}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.startDate}
              />
            </div>

            {/* Besoin d'électricité */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresElectricity"
                checked={formData.requiresElectricity}
                onChange={(e) => setFormData({ ...formData, requiresElectricity: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requiresElectricity" className="ml-2 text-sm text-gray-700">
                J&apos;ai besoin d&apos;une place avec chargeur électrique (rangées A et F)
              </label>
            </div>

            {/* Sélection de la place */}
            {formData.startDate && formData.endDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place de parking
                </label>
                {loadingSpots ? (
                  <p className="text-gray-500">Chargement des places disponibles...</p>
                ) : (
                  <select
                    value={formData.parkingSpotId}
                    onChange={(e) => setFormData({ ...formData, parkingSpotId: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez une place</option>
                    {availableSpots.map((spot: any) => (
                      <option key={spot.id} value={spot.id}>
                        {spot.id} {spot.hasCharger ? '⚡' : ''} 
                        {formData.requiresElectricity && !spot.hasCharger && ' (sans chargeur)'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !formData.parkingSpotId}
                className={`flex-1 py-2 px-4 rounded-md text-white ${
                  loading || !formData.parkingSpotId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Création...' : 'Créer la réservation'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Règles de réservation */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Règles de réservation</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Durée maximale : {user.role === 'EMPLOYEE' ? '5 jours ouvrables' : '30 jours'}</li>
            <li>• Les places avec chargeur sont dans les rangées A et F</li>
            <li>• Check-in obligatoire avant 11h00 le jour de la réservation</li>
            <li>• Les places non confirmées sont libérées automatiquement après 11h00</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 