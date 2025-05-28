"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tentative de connexion :", email, password);
        // 🚧 Appel API login ici plus tard
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-80"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Connexion
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}
