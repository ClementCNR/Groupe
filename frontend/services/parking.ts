import api from './api';
import { ParkingSpot } from '@/types/reservation';

// Données mock des places de parking
// 6 rangées (A-F) de 10 places chacune
// Rangées A et F ont des chargeurs électriques
const generateMockSpots = (): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      const number = i.toString().padStart(2, '0');
      spots.push({
        id: `${row}${number}`,
        row: row,
        number: i,
        hasCharger: row === 'A' || row === 'F',
        isAvailable: Math.random() > 0.3 // 70% de disponibilité aléatoire
      });
    }
  });
  
  return spots;
};

export const parkingService = {
  // Obtenir toutes les places de parking
  async getAllSpots(): Promise<ParkingSpot[]> {
    try {
      const response = await api.get('/parking-spots');
      return response.data;
    } catch (error) {
      // Si l'endpoint n'existe pas encore, retourner des données mock
      console.warn('Utilisation des données mock pour les places de parking');
      return generateMockSpots();
    }
  },

  // Obtenir une place spécifique
  async getSpot(id: string): Promise<ParkingSpot> {
    try {
      const response = await api.get(`/parking-spots/${id}`);
      return response.data;
    } catch (error) {
      // Mock pour une place spécifique
      const allSpots = generateMockSpots();
      const spot = allSpots.find(s => s.id === id);
      if (!spot) {
        throw new Error('Place non trouvée');
      }
      return spot;
    }
  },

  // Pour l'instant, on simule la disponibilité côté client
  async getAvailableSpots(startDate: string, endDate: string, requiresElectricity: boolean): Promise<ParkingSpot[]> {
    try {
      // Tentative d'appel à l'API backend
      const response = await api.get('/parking-spots/available', {
        params: { startDate, endDate, requiresElectricity }
      });
      return response.data;
    } catch (error) {
      
      console.warn('Utilisation des données mock pour les places disponibles');
      const allSpots = await this.getAllSpots();
      
      let availableSpots = allSpots.filter(spot => spot.isAvailable);
      
      if (requiresElectricity) {
        availableSpots = availableSpots.filter(spot => spot.hasCharger);
      }
      
      return availableSpots;
    }
  }
}; 