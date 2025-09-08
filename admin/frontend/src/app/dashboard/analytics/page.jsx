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
        return <div className="p-8 text-black">Loading analytics...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-black">
                Payment Analytics
            </h1>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Amount by Method
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
                        Status Distribution
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
                        Payments Over Days
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
                            Order ID
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Amount
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Method
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Status
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Created At
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b text-black">
                                {p.id}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {p.order_id}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                ₹{p.amount}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {p.method}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {p.status}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {p.created_at.split("T")[0]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
