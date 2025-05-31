import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchHealth(): Promise<string> {
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l\'appel à /health :", error);
        throw new Error("Échec de la requête vers le backend");
    }
}
