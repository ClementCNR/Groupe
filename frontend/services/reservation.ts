import api from './api';
import { ReservationRequest, Reservation, ReservationResponse, ParkingSpot } from '@/types/reservation';

// Générer toutes les places de parking
const generateParkingSpots = (): ParkingSpot[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const spots: ParkingSpot[] = [];

  rows.forEach(row => {
    for (let number = 1; number <= 10; number++) {
      spots.push({
        id: `${row}${number.toString().padStart(2, '0')}`,
        row,
        number,
        // Les places électriques sont dans les rangées A et F
        hasCharger: row === 'A' || row === 'F'
      });
    }
  });

  return spots;
};

// Types pour les statistiques
export interface ParkingStats {
  totalSpots: number;
  totalReservations: number;
  activeReservations: number;
  electricSpotsReserved: number;
  noShowRate: number;
  occupancyRate: number;
  reservationsByDay: { [key: string]: number };
  electricSpotsUsage: number;
}

export const reservationService = {

  async createReservation(data: ReservationRequest): Promise<ReservationResponse> {
    const response = await api.post('/reservations/create', data);
    return response.data;
  },

  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get('/reservations');
    return response.data;
  },

  async getAllReservations(): Promise<Reservation[]> {
    const response = await api.get('/reservations/all');
    return response.data;
  },

  async updateReservation(id: number, data: Partial<ReservationRequest>): Promise<ReservationResponse> {
    const response = await api.patch(`/reservations/${id}`, data);
    return response.data;
  },

  async cancelReservation(id: number): Promise<void> {
    await api.delete(`/reservations/${id}/cancel`);
  },

  async cancelReservationBySecretary(id: number, userId: string): Promise<void> {
    await api.delete(`/reservations/${id}/cancel/by-secretary?userId=${userId}`);
  },

  async checkIn(id: number): Promise<void> {
    await api.patch(`/reservations/${id}/checkin`);
  },

  async checkInBySecretary(id: number, userId: string): Promise<void> {
    await api.patch(`/reservations/${id}/checkin/by-secretary?userId=${userId}`);
  },

  getParkingSpots: (): Promise<ParkingSpot[]> => {
    return Promise.resolve(generateParkingSpots());
  },

  async getParkingStats(): Promise<ParkingStats> {
    const allReservations = await this.getAllReservations();
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrer les réservations du jour uniquement
    const todayReservations = allReservations.filter(res => res.startDate.split('T')[0] === today);

    // Calculer les statistiques sur la journée
    const totalSpots = 60; // 6 rangées * 10 places
    const electricSpots = 20; // 2 rangées * 10 places (A et F)
    
    const activeReservations = todayReservations.filter(res => 
      res.status === 'RESERVED' || res.status === 'CHECKED_IN'
    ).length;

    const electricSpotsReserved = todayReservations.filter(res => 
      (res.status === 'RESERVED' || res.status === 'CHECKED_IN') &&
      (res.parkingSpotId.startsWith('A') || res.parkingSpotId.startsWith('F'))
    ).length;

    const noShowReservations = todayReservations.filter(res => 
      res.status === 'NO_SHOW'
    ).length;

    const totalReservations = todayReservations.length;
    const noShowRate = totalReservations > 0 ? (noShowReservations / totalReservations) * 100 : 0;
    const occupancyRate = (activeReservations / totalSpots) * 100;
    const electricSpotsUsage = (electricSpotsReserved / electricSpots) * 100;

    // Réservations par jour (ici, uniquement aujourd'hui)
    const reservationsByDay: { [key: string]: number } = {};
    reservationsByDay[today] = totalReservations;

    return {
      totalSpots,
      totalReservations,
      activeReservations,
      electricSpotsReserved,
      noShowRate,
      occupancyRate,
      reservationsByDay,
      electricSpotsUsage
    };
  }
}; 