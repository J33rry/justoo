"use client";
import { useEffect, useState } from "react";
import { payments as dummyPayments } from "../payments/dummyData";
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

export default function AnalyticsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            try {
                const res = await fetch("/api/admin/analytics/payments");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setPayments(data);
                    } else {
                        setPayments(dummyPayments);
                    }
                } else {
                    setPayments(dummyPayments);
                }
            } catch {
                setPayments(dummyPayments);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    // Bar chart: Payment amount by method
    const methodTotals = payments.reduce((acc, p) => {
        acc[p.method] = (acc[p.method] || 0) + p.amount;
        return acc;
    }, {});
    const barData = {
        labels: Object.keys(methodTotals),
        datasets: [
            {
                label: "Total Amount",
                data: Object.values(methodTotals),
                backgroundColor: [
                    "rgba(34,197,94,0.7)",
                    "rgba(59,130,246,0.7)",
                    "rgba(251,191,36,0.7)",
                    "rgba(239,68,68,0.7)",
                ],
                borderRadius: 8,
                borderSkipped: false,
                borderColor: "#6366f1",
            },
        ],
    };

    // Pie chart: Payment status distribution
    const statusCounts = payments.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: "Status",
                data: Object.values(statusCounts),
                backgroundColor: [
                    "rgba(52,211,153,0.8)",
                    "rgba(248,113,113,0.8)",
                    "rgba(251,191,36,0.8)",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    // Line chart: Payments over days
    const dayTotals = {};
    payments.forEach((p) => {
        const day = p.created_at.split("T")[0];
        dayTotals[day] = (dayTotals[day] || 0) + p.amount;
    });
    const lineData = {
        labels: Object.keys(dayTotals),
        datasets: [
            {
                label: "Amount per Day",
                data: Object.values(dayTotals),
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
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading analytics...
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
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl">📊</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Payment Analytics
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Comprehensive insights into your payment data
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">💳</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Amount by Method
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
                            <span className="text-white text-sm">📈</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Status Distribution
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
                            Payments Over Time
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
                        <span className="text-2xl">💰</span>
                        Payment Details
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
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{p.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        #{p.order_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        ₹{p.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {p.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                p.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : p.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {p.created_at.split("T")[0]}
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
