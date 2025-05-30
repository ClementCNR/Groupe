import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
    title: 'Parking Reservation System',
    description: 'Réservation de places de parking en entreprise',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
        <body>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}
