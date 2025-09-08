"use client";
import React, { useEffect, useState } from "react";
import { orders as dummyOrders } from "./dummyData";
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

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setOrders(data);
                    } else {
                        setOrders(dummyOrders);
                    }
                } else {
                    setOrders(dummyOrders);
                }
            } catch {
                setOrders(dummyOrders);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Bar chart: Orders per status
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    const barData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: "Orders",
                data: Object.values(statusCounts),
                backgroundColor: [
                    "rgba(99,102,241,0.8)",
                    "rgba(34,197,94,0.8)",
                    "rgba(239,68,68,0.8)",
                    "rgba(251,191,36,0.8)",
                ],
                borderRadius: 12,
                borderSkipped: false,
                borderColor: "rgba(255,255,255,0.3)",
                borderWidth: 1,
            },
        ],
    };

    // Pie chart: Orders by user
    const userCounts = orders.reduce((acc, order) => {
        acc[order.userId] = (acc[order.userId] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(userCounts).map((id) => `User ${id}`),
        datasets: [
            {
                label: "Orders by User",
                data: Object.values(userCounts),
                backgroundColor: [
                    "rgba(99,102,241,0.8)",
                    "rgba(34,197,94,0.8)",
                    "rgba(251,191,36,0.8)",
                    "rgba(239,68,68,0.8)",
                    "rgba(139,92,246,0.8)",
                    "rgba(16,185,129,0.8)",
                    "rgba(245,158,11,0.8)",
                    "rgba(168,85,247,0.8)",
                    "rgba(59,130,246,0.8)",
                ],
                borderColor: "rgba(255,255,255,0.3)",
                borderWidth: 2,
            },
        ],
    };

    // Line chart: Total amount per day
    const dateTotals = {};
    orders.forEach((order) => {
        const date = order.createdAt.split("T")[0];
        dateTotals[date] = (dateTotals[date] || 0) + order.totalAmount;
    });
    const lineData = {
        labels: Object.keys(dateTotals),
        datasets: [
            {
                label: "Total Amount",
                data: Object.values(dateTotals),
                fill: true,
                backgroundColor: "rgba(99,102,241,0.1)",
                borderColor: "#6366f1",
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: "#6366f1",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "rgba(255,255,255,0.8)",
                    font: { size: 12, weight: "500" }
                }
            },
            tooltip: {
                backgroundColor: "rgba(0,0,0,0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255,255,255,0.2)",
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                ticks: { color: "rgba(255,255,255,0.7)" },
                grid: { color: "rgba(255,255,255,0.1)" }
            },
            y: {
                ticks: { color: "rgba(255,255,255,0.7)" },
                grid: { color: "rgba(255,255,255,0.1)" }
            },
        },
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            completed: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            processing: "bg-blue-100 text-blue-800 border-blue-200"
        };
        return statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Order Management
                </h1>
                <p className="text-purple-200">Track and analyze customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-white mt-1">{totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-1">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Average Order</p>
                            <p className="text-3xl font-bold text-white mt-1">${averageOrderValue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Pending Orders</p>
                            <p className="text-3xl font-bold text-white mt-1">{pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-white mb-4">Orders by Status</h3>
                    <div className="h-64">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-white mb-4">Orders by User</h3>
                    <div className="h-64">
                        <Pie data={pieData} options={{...chartOptions, maintainAspectRatio: false}} />
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
                    <div className="h-64">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20">
                    <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-purple-200 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {orders.map((order, index) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        User {order.userId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                                        ${order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {order.itemCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-purple-200 max-w-xs truncate">
                                        {order.notes}
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
