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
                    "rgba(99,102,241,0.7)",
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
                    "rgba(248,113,113,0.8)",
                    "rgba(52,211,153,0.8)",
                    "rgba(96,165,250,0.8)",
                    "rgba(251,191,36,0.8)",
                    "rgba(167,139,250,0.8)",
                    "rgba(34,197,94,0.8)",
                    "rgba(239,68,68,0.8)",
                    "rgba(251,191,36,0.8)",
                    "rgba(167,139,250,0.8)",
                    "rgba(99,102,241,0.8)",
                ],
                borderColor: "#fff",
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
        return <div className="p-8 text-black">Loading orders...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-black">Orders</h1>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Orders per Status
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
                        Orders by User
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
                        Total Amount per Day
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
                        <th className="px-4 py-2 border-b text-black">
                            Order ID
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            User ID
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Status
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Total Amount
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Item Count
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Created At
                        </th>
                        <th className="px-4 py-2 border-b text-black">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-4 py-2 border-b text-black">
                                {order.id}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {order.userId}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {order.status}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                ${order.totalAmount}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {order.itemCount}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {order.createdAt}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {order.notes}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
