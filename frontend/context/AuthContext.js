"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedUserRaw = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUserRaw && savedToken) {
            try {
                const parsedUser = JSON.parse(savedUserRaw);
                setUser(parsedUser);
                setToken(savedToken);
            } catch (err) {
                console.error("Erreur de parsing du user :", err);
                setUser(null);
                setToken(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            setError(null); // Reset erreur
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Échec de la connexion");
            }

            const data = await response.json();

            if (!data.token || !data.id) {
                throw new Error("Données utilisateur ou token manquantes");
            }

            // Reconstruire l'objet user à partir des champs renvoyés
            const user = {
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
            };

            setUser(user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", data.token);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
