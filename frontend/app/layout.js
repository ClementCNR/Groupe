import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Parking Reservation System",
  description: "Réservation de places de parking en entreprise",
};

export default function RootLayout({ children }) {
  return (
      <html lang="fr">
      <body>
      <Navbar />
      <main>{children}</main>
      </body>
      </html>
  );
}
