import './globals.css';

export const metadata = {
    title: 'Parking Reservation System',
    description: 'Réservation de places de parking en entreprise',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>
                {children}
            </body>
        </html>
    );
}
