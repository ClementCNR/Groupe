import { useState, useCallback } from 'react';
import { reservationService } from '@/services/reservation';
import { ReservationRequest, Reservation } from '@/types/reservation';
import { authService } from '@/services/authService';

export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const user = authService.getUser();
  const userRole = user?.role || '';

  // Calculer les limites de réservation selon le rôle
  const getMaxReservationDays = () => {
    switch (userRole) {
      case 'MANAGER':
        return 30;
      case 'EMPLOYEE':
      default:
        return 5;
    }
  };

  // Créer une réservation
  const createReservation = useCallback(async (data: ReservationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.createReservation(data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les réservations
  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = userRole === 'SECRETARY' 
        ? await reservationService.getAllReservations()
        : await reservationService.getMyReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Annuler une réservation
  const cancelReservation = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await reservationService.cancelReservation(id);
      await loadReservations(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  // Annuler une réservation (pour les secrétaires)
  const cancelReservationBySecretary = useCallback(async (id: number, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await reservationService.cancelReservationBySecretary(id, userId);
      await loadReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation (secrétaire)");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  // Check-in
  const checkIn = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await reservationService.checkIn(id);
      await loadReservations(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du check-in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  const checkInBySecretary = useCallback(async (id: number, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await reservationService.checkInBySecretary(id, userId);
      await loadReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du check-in (secrétaire)');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  return {
    loading,
    error,
    reservations,
    userRole,
    maxReservationDays: getMaxReservationDays(),
    createReservation,
    loadReservations,
    cancelReservation,
    cancelReservationBySecretary,
    checkIn,
    checkInBySecretary
  };
}; 