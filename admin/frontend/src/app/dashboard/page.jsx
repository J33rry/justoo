"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalOrders: 156,
        totalRiders: 23,
        totalItems: 89,
        totalRevenue: 12450.5,
    });

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/signIn");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Welcome back, {user.username}! 👋
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Here's what's happening with your business today.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Today</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Total Orders</p>
                            <p className="text-3xl font-bold">
                                {stats.totalOrders}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🛒</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-green-300">↗ +12%</span>
                        <span className="text-blue-100 text-sm">
                            vs last month
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Active Riders</p>
                            <p className="text-3xl font-bold">
                                {stats.totalRiders}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🏍️</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-green-300">↗ +5%</span>
                        <span className="text-green-100 text-sm">
                            vs last month
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Total Items</p>
                            <p className="text-3xl font-bold">
                                {stats.totalItems}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">📦</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-purple-300">↗ +8%</span>
                        <span className="text-purple-100 text-sm">
                            vs last month
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100">Total Revenue</p>
                            <p className="text-3xl font-bold">
                                ₹{stats.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">💰</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-orange-300">↗ +15%</span>
                        <span className="text-orange-100 text-sm">
                            vs last month
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/dashboard/orders")}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="font-medium">
                                View Recent Orders
                            </span>
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/riders")}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
                        >
                            <span className="text-xl">🏍️</span>
                            <span className="font-medium">Manage Riders</span>
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/analytics")}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
                        >
                            <span className="text-xl">📊</span>
                            <span className="font-medium">View Analytics</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        System Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-800">
                                    Database
                                </span>
                            </div>
                            <span className="text-green-600 font-medium">
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-800">
                                    API Server
                                </span>
                            </div>
                            <span className="text-green-600 font-medium">
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-blue-800">
                                    Payment Gateway
                                </span>
                            </div>
                            <span className="text-blue-600 font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
