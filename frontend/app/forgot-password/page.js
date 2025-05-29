"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Demande de reset pour :", email);
        // 🚧 Appel API reset password ici plus tard
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-80"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Mot de passe oublié
                </h1>

                <input
                    type="email"
                    placeholder="Nouveau mot de passe"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Confirmer mot de passe"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Réinitialiser mon mot de passe
                </button>
            </form>
        </div>
    );
}
