export interface ReservationRequest {
  parkingSpotId: string;
  startDate: string; 
  endDate: string;  
  requiresElectricity: boolean;
}

export interface Reservation {
  id: number;
  userId: number;
  parkingSpotId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  checkInTime?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface ReservationResponse {
  id: number;
  parkingSpotId: string;
  startDate: string;
  endDate: string;
  status: string;
  checkInTime?: string;
}

export interface ParkingSpot {
  id: string;
  row: string;
  number: number;
  hasCharger: boolean;
  isAvailable: boolean;
} 