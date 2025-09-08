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
        return <div className="p-8 text-black">Loading riders...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-black">Riders</h1>
            <button
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                onClick={handleAddRider}
            >
                Add Rider
            </button>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Riders per Status
                    </h2>
                    <Bar
                        data={barData}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { ticks: { color: "#111" } },
                                y: { ticks: { color: "#111" } },
                            },
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Active vs Inactive
                    </h2>
                    <Pie
                        data={pieData}
                        options={{
                            responsive: true,
                            plugins: { legend: { labels: { color: "#111" } } },
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Last Login (Day)
                    </h2>
                    <Line
                        data={lineData}
                        options={{
                            responsive: true,
                            plugins: { legend: { labels: { color: "#111" } } },
                            scales: {
                                x: { ticks: { color: "#111" } },
                                y: { ticks: { color: "#111" } },
                            },
                        }}
                    />
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-black">ID</th>
                        <th className="px-4 py-2 border-b text-black">
                            Username
                        </th>
                        <th className="px-4 py-2 border-b text-black">Email</th>
                        <th className="px-4 py-2 border-b text-black">Phone</th>
                        <th className="px-4 py-2 border-b text-black">
                            Status
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Active
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Last Login
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {riders.map((rider) => (
                        <tr
                            key={rider.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => handleEditRider(rider)}
                        >
                            <td className="px-4 py-2 border-b text-black">
                                {rider.id}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.username}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.email}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.phone}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.status}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.isActive ? "Active" : "Inactive"}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {rider.lastLogin}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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

            {/* Rider Form Modal */}
            {showForm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <form
                        className="bg-white p-6 rounded-lg shadow-lg min-w-[320px]"
                        onSubmit={handleFormSubmit}
                    >
                        <h2 className="text-xl font-bold mb-4 text-black">
                            {formType === "add" ? "Add Rider" : "Edit Rider"}
                        </h2>
                        <div className="mb-2">
                            <label className="block text-black mb-1">
                                Username
                            </label>
                            <input
                                name="username"
                                defaultValue={selectedRider?.username || ""}
                                required
                                className="w-full border px-2 py-1 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-black mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={selectedRider?.email || ""}
                                required
                                className="w-full border px-2 py-1 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-black mb-1">
                                Phone
                            </label>
                            <input
                                name="phone"
                                defaultValue={selectedRider?.phone || ""}
                                required
                                className="w-full border px-2 py-1 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-black mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={selectedRider?.status || "active"}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    defaultChecked={
                                        selectedRider?.isActive === 1
                                    }
                                    className="mr-2"
                                />
                                <span className="text-black">Is Active</span>
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {formType === "add" ? "Add" : "Update"}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 px-4 py-2 rounded"
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
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px]">
                        <h2 className="text-xl font-bold mb-4 text-black">
                            Confirm Delete
                        </h2>
                        <p className="mb-4 text-black">
                            Are you sure you want to delete this rider?
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={confirmDeleteRider}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
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
