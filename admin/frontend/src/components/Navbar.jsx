"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Image
                    src="/app-logo.png"
                    alt="App Logo"
                    width={40}
                    height={40}
                />
                <span className="text-xl font-bold text-gray-900">
                    Justoo Admin
                </span>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-gray-700">
                        Welcome, {user.username}
                    </span>
                )}
                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
