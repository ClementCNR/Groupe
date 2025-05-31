import api from './api';
import { ReservationRequest, Reservation, ReservationResponse } from '@/types/reservation';

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

  async checkIn(id: number): Promise<void> {
    await api.patch(`/reservations/${id}/checkin`);
  }
}; 