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
        return <div className="p-8 text-black">Loading items...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-black">
                Items Inventory
            </h1>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-black">
                        Quantity per Item
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
                        Category Distribution
                    </h2>
                    <Pie
                        data={pieData}
                        options={{
                            responsive: true,
                            plugins: { legend: { labels: { color: "#111" } } },
                        }}
                    />
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-black">Name</th>
                        <th className="px-4 py-2 border-b text-black">Price</th>
                        <th className="px-4 py-2 border-b text-black">
                            Quantity
                        </th>
                        <th className="px-4 py-2 border-b text-black">Unit</th>
                        <th className="px-4 py-2 border-b text-black">
                            Category
                        </th>
                        <th className="px-4 py-2 border-b text-black">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 border-b text-black">
                                {item.name}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                ${item.price}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {item.quantity}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {item.unit}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {item.category}
                            </td>
                            <td className="px-4 py-2 border-b text-black">
                                {item.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
