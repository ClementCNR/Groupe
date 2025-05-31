'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { reservationService } from '@/services/reservation';
import { parkingService } from '@/services/parking';
import { useReservation } from '@/hooks/useReservation';
import Navbar from '@/components/Navbar';
import { Reservation, ParkingSpot } from '@/types/reservation';
import { CSSTransition } from 'react-transition-group';
import '../styles/ParkingMapAnimation.css';
import { toast } from 'react-toastify';

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
  const [allSpots, setAllSpots] = useState<ParkingSpot[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<string>('');
  const mapRef = useRef(null);

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

  // Charger toutes les places et toutes les réservations au montage
  useEffect(() => {
    parkingService.getAllSpots().then(setAllSpots);
    reservationService.getAllReservations().then(setAllReservations);
  }, []);

  // Filtrer les places occupées pour la période choisie
  const getUnavailableSpots = () => {
    if (!formData.startDate || !formData.endDate) return [];
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return allReservations.filter(res => {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      // Chevauchement de période
      return (
        res.status !== 'CANCELLED' &&
        res.status !== 'COMPLETED' &&
        res.parkingSpotId &&
        resEnd >= start && resStart <= end
      );
    }).map(res => res.parkingSpotId);
  };

  const unavailableSpots = getUnavailableSpots();

  // Map visuelle du parking
  const renderParkingMap = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        {/* Légende */}
        <div className="flex gap-4 mb-6 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-200 border-2 border-green-500 rounded flex items-center justify-center"></div>
            <span className="text-green-700">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-300 border-2 border-red-500 rounded flex items-center justify-center"></div>
            <span className="text-red-700">Occupée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <span className="text-blue-700">Sélectionnée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border-2 border-orange-400 rounded flex items-center justify-center">
              <span className="text-orange-500 text-xl">⚡</span>
            </div>
            <span className="text-orange-600">Place électrique</span>
          </div>
        </div>

        {/* Entrée du parking */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded">
            <span>↓</span> ENTRÉE
          </div>
        </div>

        {/* Plan du parking */}
        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <div key={row}>
              {/* Rangée avec allée */}
              <div className="flex items-center">
                {/* Label de rangée */}
                <div className="w-12 text-center font-bold text-lg">{row}</div>
                
                {/* Places de parking */}
                <div className="flex gap-2">
                  {allSpots.filter(s => s.row === row).map(spot => {
                    const isUnavailable = unavailableSpots.includes(spot.id);
                    const isSelected = selectedSpot === spot.id;
                    const isElectric = spot.hasCharger;
                    // Nouvelle règle : désactiver A/F si non électrique
                    const isDisabledByType = !formData.requiresElectricity && isElectric;
                    let bg = 'bg-green-200 border-green-500 text-green-900';
                    if (isUnavailable || isDisabledByType) bg = 'bg-red-300 border-red-500 text-red-900';
                    if (isSelected) bg = 'bg-blue-600 border-blue-700 text-white';
                    let border = isElectric ? 'border-2 border-orange-400' : 'border-2';
                    const disabled = isUnavailable || isDisabledByType;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            setSelectedSpot(spot.id);
                            setFormData({ ...formData, parkingSpotId: spot.id });
                          }
                        }}
                        className={`
                          relative w-16 h-20 rounded-lg transition-all duration-200 transform font-bold
                          ${bg} ${border}
                          ${disabled 
                            ? 'cursor-not-allowed' 
                            : isSelected 
                              ? 'scale-105 shadow-lg' 
                              : 'hover:scale-105 hover:shadow-md cursor-pointer'
                          }
                        `}
                        title={
                          disabled
                            ? isElectric && isDisabledByType
                              ? `Réservée aux véhicules électriques`
                              : `Place ${spot.id} - Occupée`
                            : `Place ${spot.id}${isElectric ? ' - Électrique' : ''} - Cliquez pour sélectionner`
                        }
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={`font-semibold ${isSelected ? 'text-white' : disabled ? 'text-red-900' : 'text-green-900'}`}>
                            {spot.id}
                          </span>
                          {isElectric && (
                            <span className={`text-2xl ${isSelected ? 'text-orange-200' : 'text-orange-500'}`}>
                              ⚡
                            </span>
                          )}
                          {disabled && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Allée entre les rangées */}
              {rowIndex === 1 || rowIndex === 3 ? (
                <div className="flex items-center ml-12 my-4">
                  <div className="flex-1 h-12 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                    <span className="flex items-center gap-2">
                      <span>←</span> Allée de circulation <span>→</span>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Sortie du parking */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded">
            SORTIE <span>↓</span>
          </div>
        </div>
      </div>
    );
  };

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
      toast.success('Réservation créée avec succès !');
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

  const showMap = formData.startDate && formData.endDate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Nouvelle Réservation</h1>
        <div className={`gap-8 ${showMap ? 'flex flex-col lg:flex-row items-start' : 'flex flex-col items-center'}`}>
          {/* Formulaire */}
          <div className={`bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full ${showMap ? 'mr-auto' : 'mx-auto'}`}>
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
              {/* Sélection de la place (juste l'affichage du choix) */}
              {showMap && selectedSpot && !unavailableSpots.includes(selectedSpot) && (
                <div className="mt-2 text-green-600 font-semibold">Place sélectionnée : {selectedSpot}</div>
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
          {/* Carte du parking avec animation */}
          <CSSTransition
            in={!!showMap}
            timeout={400}
            classNames="parking-map-fade"
            unmountOnExit
            nodeRef={mapRef}
          >
            <div ref={mapRef} className="w-full lg:w-auto min-w-[350px]">
              {allSpots.length === 0 ? (
                <p className="text-gray-500">Chargement de la carte...</p>
              ) : (
                renderParkingMap()
              )}
            </div>
          </CSSTransition>
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