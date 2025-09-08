"use client";
import React, { useEffect, useState } from "react";
import { items as dummyItems } from "./dummyData";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchItems() {
            try {
                const res = await fetch("/api/inventory");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setItems(data);
                    } else {
                        setItems(dummyItems);
                    }
                } else {
                    setItems(dummyItems);
                }
            } catch {
                setItems(dummyItems);
            } finally {
                setLoading(false);
            }
        }
        fetchItems();
    }, []);

    // Bar chart: Quantity per item
    const barData = {
        labels: items.map((item) => item.name),
        datasets: [
            {
                label: "Quantity",
                data: items.map((item) => item.quantity),
                backgroundColor: "rgba(99,102,241,0.7)",
                borderRadius: 8,
                borderSkipped: false,
                borderColor: "#6366f1",
            },
        ],
    };

    // Pie chart: Category distribution
    const categoryCounts = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                label: "Category",
                data: Object.values(categoryCounts),
                backgroundColor: [
                    "rgba(248,113,113,0.8)",
                    "rgba(52,211,153,0.8)",
                    "rgba(96,165,250,0.8)",
                    "rgba(251,191,36,0.8)",
                    "rgba(167,139,250,0.8)",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading items...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl">📦</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Inventory Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Monitor and analyze your product inventory
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📊</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Quantity per Item
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
                            <span className="text-white text-sm">🥧</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Category Distribution
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
            </div>

            {/* Data Table */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        Items Details
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Unit
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        ₹{item.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
