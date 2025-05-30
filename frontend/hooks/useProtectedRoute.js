"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(allowedRoles = []) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (!allowedRoles.includes(user.role)) {
            router.push("/unauthorized");
        }
    }, [user, allowedRoles]);
}
