import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const metadata = {
    title: 'Parking Reservation System',
    description: 'Réservation de places de parking en entreprise',
};

export default function RootLayout({ children }) {
    return (
      <html lang="fr">
        <body>
          {children}
          <ToastContainer position="top-center" />
        </body>
      </html>
    );
  }
