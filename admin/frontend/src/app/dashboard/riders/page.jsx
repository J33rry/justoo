"use client";
import React, { useEffect, useState } from "react";
import { riders as dummyRiders } from "./dummyData";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function RidersPage() {
    // All logic and hooks
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState("add"); // "add" or "edit"
    const [selectedRider, setSelectedRider] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteRiderId, setDeleteRiderId] = useState(null);

    useEffect(() => {
        async function fetchRiders() {
            try {
                const res = await fetch("/api/riders");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setRiders(data);
                    } else {
                        setRiders(dummyRiders);
                    }
                } else {
                    setRiders(dummyRiders);
                }
            } catch {
                setRiders(dummyRiders);
            } finally {
                setLoading(false);
            }
        }
        fetchRiders();
    }, []);

    // Add Rider
    const handleAddRider = () => {
        setFormType("add");
        setSelectedRider(null);
        setShowForm(true);
    };

    // Edit Rider
    const handleEditRider = (rider) => {
        setFormType("edit");
        setSelectedRider(rider);
        setShowForm(true);
    };

    // Delete Rider
    const handleDeleteRider = (id) => {
        setDeleteRiderId(id);
        setShowDeleteDialog(true);
    };

    const confirmDeleteRider = async () => {
        try {
            const res = await fetch(`/api/riders/${deleteRiderId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setRiders((prev) => prev.filter((r) => r.id !== deleteRiderId));
            }
        } finally {
            setShowDeleteDialog(false);
            setDeleteRiderId(null);
        }
    };

    // Submit Add/Edit Rider
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const riderData = {
            username: form.username.value,
            email: form.email.value,
            phone: form.phone.value,
            status: form.status.value,
            isActive: form.isActive.checked ? 1 : 0,
        };
        let res;
        if (formType === "add") {
            res = await fetch("/api/riders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(riderData),
            });
        } else {
            res = await fetch(`/api/riders/${selectedRider.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(riderData),
            });
        }
        if (res.ok) {
            const updated = await res.json();
            if (formType === "add") {
                setRiders((prev) => [...prev, updated]);
            } else {
                setRiders((prev) =>
                    prev.map((r) => (r.id === updated.id ? updated : r))
                );
            }
            setShowForm(false);
            setSelectedRider(null);
        }
    };

    // Bar chart: Riders per status
    const statusCounts = riders.reduce((acc, rider) => {
        acc[rider.status] = (acc[rider.status] || 0) + 1;
        return acc;
    }, {});
    const barData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: "Riders",
                data: Object.values(statusCounts),
                backgroundColor: [
                    "rgba(34,197,94,0.7)",
                    "rgba(239,68,68,0.7)",
                    "rgba(251,191,36,0.7)",
                ],
                borderRadius: 8,
                borderSkipped: false,
                borderColor: "#6366f1",
            },
        ],
    };

    // Pie chart: Active vs Inactive
    const activeCounts = riders.reduce((acc, rider) => {
        acc[rider.isActive ? "Active" : "Inactive"] =
            (acc[rider.isActive ? "Active" : "Inactive"] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(activeCounts),
        datasets: [
            {
                label: "Active Status",
                data: Object.values(activeCounts),
                backgroundColor: [
                    "rgba(52,211,153,0.8)",
                    "rgba(248,113,113,0.8)",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    // Line chart: Last login per rider
    const lineData = {
        labels: riders.map((r) => r.username),
        datasets: [
            {
                label: "Last Login (Day of Month)",
                data: riders.map((r) => parseInt(r.lastLogin.split("-")[2])),
                fill: false,
                borderColor: "#6366f1",
                backgroundColor: "#6366f1",
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: "#6366f1",
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading riders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-3xl">🏍️</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Riders Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage and monitor your delivery riders
                            </p>
                        </div>
                    </div>
                    <button
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                        onClick={handleAddRider}
                    >
                        <span className="text-xl">➕</span>
                        <span>Add New Rider</span>
                    </button>
                </div>
            </div>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📊</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Riders per Status
                        </h2>
                    </div>
                    <div className="h-80">
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        titleColor: "white",
                                        bodyColor: "white",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                        borderWidth: 1,
                                        cornerRadius: 10,
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        grid: { display: false },
                                    },
                                    y: {
                                        ticks: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🟢</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Active vs Inactive
                        </h2>
                    </div>
                    <div className="h-80">
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        position: "bottom",
                                    },
                                    tooltip: {
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        titleColor: "white",
                                        bodyColor: "white",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                        borderWidth: 1,
                                        cornerRadius: 10,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📅</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Last Login Activity
                        </h2>
                    </div>
                    <div className="h-80">
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        position: "top",
                                    },
                                    tooltip: {
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        titleColor: "white",
                                        bodyColor: "white",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                        borderWidth: 1,
                                        cornerRadius: 10,
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                                    },
                                    y: {
                                        ticks: {
                                            color: "#4B5563",
                                            font: { weight: "bold" },
                                        },
                                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-2xl">🏍️</span>
                        Riders Details
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Active
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {riders.map((rider) => (
                                <tr
                                    key={rider.id}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => handleEditRider(rider)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{rider.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rider.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rider.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rider.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                rider.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : rider.status ===
                                                      "inactive"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {rider.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                rider.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {rider.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {rider.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRider(rider.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rider Form Modal */}
            {showForm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <form
                        className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 min-w-[400px]"
                        onSubmit={handleFormSubmit}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                            <span className="text-3xl">🏍️</span>
                            {formType === "add"
                                ? "Add New Rider"
                                : "Edit Rider"}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Username
                                </label>
                                <input
                                    name="username"
                                    defaultValue={selectedRider?.username || ""}
                                    required
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={selectedRider?.email || ""}
                                    required
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    name="phone"
                                    defaultValue={selectedRider?.phone || ""}
                                    required
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    defaultValue={
                                        selectedRider?.status || "active"
                                    }
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    defaultChecked={
                                        selectedRider?.isActive === 1
                                    }
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                                <label className="text-gray-700 font-medium">
                                    Is Active
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {formType === "add"
                                    ? "Add Rider"
                                    : "Update Rider"}
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 min-w-[400px]">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                            <span className="text-3xl">⚠️</span>
                            Confirm Delete
                        </h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete this rider? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                onClick={confirmDeleteRider}
                            >
                                Delete Rider
                            </button>
                            <button
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// ...existing code...
