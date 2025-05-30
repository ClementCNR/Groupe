"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserReservations() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        fetchReservations();
    }, [user, token, router]);

    const fetchReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/api/reservations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Erreur lors du chargement des réservations");
            }

            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/${id}/cancel`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Erreur lors de l'annulation");
            }

            await fetchReservations(); // Refresh après annulation
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement des réservations...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
    }

    if (reservations.length === 0) {
        return <div className="flex justify-center items-center h-screen text-gray-600">Aucune réservation trouvée.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">Mes Réservations</h1>

            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2 text-left text-black">ID</th>
                    <th className="border p-2 text-left text-black">Place</th>
                    <th className="border p-2 text-left text-black">Début</th>
                    <th className="border p-2 text-left text-black">Fin</th>
                    <th className="border p-2 text-left text-black">État</th>
                    <th className="border p-2 text-left text-black">Check-In</th>
                    <th className="border p-2 text-left text-black">Actions</th>
                </tr>
                </thead>

                <tbody>
                {reservations.map((res) => (
                    <tr key={res.id}>
                        <td className="border p-2">{res.id}</td>
                        <td className="border p-2">{res.parkingSpotId}</td>
                        <td className="border p-2">{res.startDate}</td>
                        <td className="border p-2">{res.endDate}</td>
                        <td className="border p-2">{res.status}</td>
                        <td className="border p-2">{res.checkInTime ? res.checkInTime : "-"}</td>
                        <td className="border p-2">
                            {res.status === "RESERVED" && (
                                <button
                                    onClick={() => handleCancel(res.id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Annuler
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
