"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { inventoryAPI } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
    CubeIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const statPalette = {
    blue: "from-sky-500/30 via-sky-500/10 to-transparent text-sky-100",
    green: "from-emerald-500/30 via-emerald-500/10 to-transparent text-emerald-100",
    red: "from-rose-500/30 via-rose-500/10 to-transparent text-rose-100",
    amber: "from-amber-500/30 via-amber-500/10 to-transparent text-amber-100",
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await inventoryAPI.getDashboardStats();
            setStats(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch dashboard stats");
            console.error("Dashboard stats error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner />
            </DashboardLayout>
        );
    }

    const inventoryValue = Number(
        stats?.totalValue ?? stats?.totalInventoryValue ?? 0
    );
    const activeItems = stats?.activeItems ?? stats?.totalItems ?? 0;
    const inactiveItems =
        stats?.inactiveItems ??
        Math.max((stats?.totalItems ?? 0) - activeItems, 0);
    const lastUpdatedLabel = stats?.generatedAt
        ? formatDateTime(stats.generatedAt)
        : formatDateTime(new Date());

    const statCards = [
        {
            name: "Total Items",
            stat: stats?.totalItems || 0,
            icon: CubeIcon,
            palette: statPalette.blue,
            subtext: "Across all categories",
        },
        {
            name: "In Stock Items",
            stat: stats?.inStockItems || 0,
            icon: ChartBarIcon,
            palette: statPalette.green,
            subtext: "Ready for fulfillment",
        },
        {
            name: "Out of Stock",
            stat: stats?.outOfStockItems || 0,
            icon: ExclamationTriangleIcon,
            palette: statPalette.red,
            subtext: "Needs restocking",
        },
        {
            name: "Low Stock Items",
            stat: stats?.lowStockItems || 0,
            icon: ExclamationTriangleIcon,
            palette: statPalette.amber,
            subtext: "Below threshold",
        },
    ];

    const quickActions = [
        {
            label: "Add Item",
            description: "Capture product details & imagery",
            href: "/dashboard/inventory/add",
            icon: CubeIcon,
        },
        {
            label: "View Inventory",
            description: "Filters, search and audit trails",
            href: "/dashboard/inventory",
            icon: ChartBarIcon,
        },
        {
            label: "View Orders",
            description: "Track fulfillment performance",
            href: "/dashboard/orders",
            icon: ShoppingCartIcon,
        },
        {
            label: "Reports",
            description: "Download KPIs & analytics",
            href: "/dashboard/reports",
            icon: ChartBarIcon,
        },
    ];

    return (
        <DashboardLayout>
            <section className="space-y-8">
                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/40 backdrop-blur-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                                Live metrics
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-white">
                                Inventory pulse at a glance
                            </h1>
                            <p className="mt-3 max-w-2xl text-slate-300">
                                Stay ahead of stock-outs and proactively
                                rebalance inventory with real-time performance
                                signals across every SKU.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Inventory value
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-white">
                                {formatCurrency(inventoryValue)}
                            </p>
                            <p className="text-xs text-emerald-300">
                                Active items: {activeItems}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((item) => (
                        <div
                            key={item.name}
                            className="stat-card rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-xl shadow-black/30 backdrop-blur-xl"
                        >
                            <div
                                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.palette} inline-flex items-center justify-center p-3`}
                            >
                                <item.icon
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                                {item.name}
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-white">
                                {item.stat}
                            </p>
                            <p className="text-sm text-slate-400">
                                {item.subtext}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">
                                Quick actions
                            </h3>
                            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Workflow
                            </span>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    type="button"
                                    onClick={() =>
                                        (window.location.href = action.href)
                                    }
                                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white transition hover:border-white/30 hover:bg-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-2xl bg-white/10 p-2">
                                            <action.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {action.label}
                                            </p>
                                            <p className="text-sm text-slate-300">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/40 backdrop-blur-xl">
                        <h3 className="text-lg font-medium text-white">
                            System information
                        </h3>
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Total value</span>
                                <span className="font-semibold text-white">
                                    {formatCurrency(inventoryValue)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Active items</span>
                                <span className="font-semibold text-white">
                                    {activeItems}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Inactive items</span>
                                <span className="font-semibold text-white">
                                    {inactiveItems}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Last updated</span>
                                <span className="font-semibold text-white">
                                    {lastUpdatedLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}
