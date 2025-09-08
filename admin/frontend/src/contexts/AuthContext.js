"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/me", {
                credentials: "include",
            });
            // console.log(response);

            if (response.ok) {
                const data = await response.json();
                // console.log(data.data.user);
                setUser(data.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // After login, re-check auth to update user state from backend
                await checkAuth();
                router.push("/dashboard");
                return { success: true, message: data.message };
            } else {
                setUser(null);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            return { success: false, message: "Login failed" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/signout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            router.push("/signIn");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
