import api from "./api";
import Cookies from "js-cookie";
import { LoginRequest, AuthResponse, User } from "@/types/auth";


const isBrowser = typeof window !== 'undefined';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    },

    setAuthData(data: AuthResponse) {
        if (isBrowser) {
            Cookies.set('auth_token', data.token, { 
                path: '/',
                sameSite: 'lax',
                expires: 7
            });
            
            const userData: User = {
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            };
            localStorage.setItem('user', JSON.stringify(userData));
        }
    },

    getToken(): string | null {
        if (isBrowser) {
            return Cookies.get('auth_token') || null;
        }
        return null;
    },

    getUser(): User | null {
        if (isBrowser) {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    logout() {
        if (isBrowser) {
            Cookies.remove('auth_token', { path: '/' });
            localStorage.removeItem('user');
        }
    }
}; 