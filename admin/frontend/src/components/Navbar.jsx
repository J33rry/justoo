"use client";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 px-6 py-4 ml-64 sticky top-0 z-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Admin Dashboard
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                                <span className="text-2xl">👋</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Welcome back!
                                    </p>
                                    {user && (
                                        <p className="text-xs text-gray-600">
                                            {user.username}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                                {user?.username?.charAt(0).toUpperCase() || "A"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                    >
                        <span>Logout</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                            →
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
