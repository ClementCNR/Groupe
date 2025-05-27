"use client";

import { useState } from "react";

export default function ReservationsPage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleReservation = (e) => {
        e.preventDefault();
        console.log("Réservation : ", startDate, endDate);
        // 🚧 Appel API ici plus tard
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleReservation}
                className="bg-white p-8 rounded shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">
                    Réserver une place
                </h1>

                <label className="block mb-2 font-medium">Date de début :</label>
                <input
                    type="date"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                <label className="block mb-2 font-medium">Date de fin :</label>
                <input
                    type="date"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Réserver
                </button>
            </form>
        </div>
    );
}
