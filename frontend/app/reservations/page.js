"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ReservationPage() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [parkingSpotId, setParkingSpotId] = useState("A01");
    const [requiresElectricity, setRequiresElectricity] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mettre à jour les places selon la checkbox
    const getFilteredSpots = () => {
        const rows = requiresElectricity ? ["A", "F"] : ["A", "B", "C", "D", "E", "F"];
        return rows.flatMap(row =>
            Array.from({ length: 10 }, (_, i) => `${row}${String(i + 1).padStart(2, "0")}`)
        );
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation des dates
        if (new Date(startDate) > new Date(endDate)) {
            setError("La date de début doit être antérieure à la date de fin.");
            return;
        }
        const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1; // +1 pour inclure le jour de début
        if (diffDays > 5) {
            setError("La réservation ne peut pas dépasser 5 jours.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/reservations/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    parkingSpotId,
                    startDate,
                    endDate,
                    requiresElectricity,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Erreur lors de la réservation");
            }

            const data = await response.json();
            setSuccess(`Réservation réussie pour ${data.parkingSpotId} du ${data.startDate} au ${data.endDate}`);
            setStartDate("");
            setEndDate("");
            setParkingSpotId("A01");
            setRequiresElectricity(false);

            setTimeout(() => router.push("/dashboard"), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleReservation} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Réserver une place</h1>

                <label className="block mb-2 text-black">Date de début :</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mb-4 p-2 border rounded text-black placeholder-black"
                    placeholder="jj/mm/aaaa"
                    required
                />

                <label className="block mb-2 text-black">Date de fin :</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mb-4 p-2 border rounded text-black placeholder-black"
                    placeholder="jj/mm/aaaa"
                    required
                />

                <label className="block mb-2 text-black">Choisir une place :</label>
                <select
                    value={parkingSpotId}
                    onChange={(e) => setParkingSpotId(e.target.value)}
                    className="w-full mb-4 p-2 border rounded text-black"
                >
                    {getFilteredSpots().map(spot => (
                        <option key={spot} value={spot}>{spot}</option>
                    ))}
                </select>

           <label className="flex items-center mb-4 text-black">
    <input
        type="checkbox"
        checked={requiresElectricity}
        onChange={(e) => setRequiresElectricity(e.target.checked)}
        className="mr-2"
    />
    Besoin d&rsquo;une prise électrique (A / F uniquement)
</label>


                <button
                    type="submit"
                    className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={loading}
                >
                    {loading ? "Réservation en cours..." : "Réserver"}
                </button>

                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
            </form>
        </div>
    );
}
