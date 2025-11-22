"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { inventoryAPI, orderAPI } from "@/lib/api";
import { formatCurrency, formatDateTime, ORDER_STATUS } from "@/lib/utils";
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CloudArrowDownIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const labelClasses =
    "text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400";
const cardClasses =
    "rounded-3xl border border-white/5 bg-white/5 shadow-card shadow-black/30 backdrop-blur-2xl";

export default function ReportsPage() {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const [statsResponse, ordersResponse] = await Promise.all([
                inventoryAPI.getDashboardStats(),
                orderAPI.getAllOrders({ limit: 10 }),
            ]);
            setDashboardStats(statsResponse.data.data);
            setRecentOrders(ordersResponse.data.data);
        } catch (error) {
            toast.error("Failed to fetch report data");
            console.error("Report data error:", error);
        } finally {
            setLoading(false);
        }
    };

    const recentOrderFigures = useMemo(() => {
        const totalAmount = recentOrders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0
        );
        const itemCount = recentOrders.reduce(
            (sum, order) => sum + Number(order.itemCount || 0),
            0
        );
        return {
            totalAmount,
            itemCount,
            avgAmount: recentOrders.length
                ? totalAmount / recentOrders.length
                : 0,
        };
    }, [recentOrders]);

    const highlightStats = useMemo(
        () => [
            {
                label: "Inventory Value",
                value: formatCurrency(dashboardStats?.totalInventoryValue || 0),
                detail: `${dashboardStats?.totalItems || 0} tracked SKUs`,
            },
            {
                label: "Low Stock Alerts",
                value: dashboardStats?.lowStockItems || 0,
                detail: `${dashboardStats?.outOfStockItems || 0} critical`,
            },
            {
                label: "Order Velocity",
                value: `${recentOrders.length} orders`,
                detail: "Last 10 records",
            },
            {
                label: "Avg Order Value",
                value: formatCurrency(recentOrderFigures.avgAmount),
                detail: `Across ${recentOrders.length || 0} orders`,
            },
        ],
        [dashboardStats, recentOrderFigures.avgAmount, recentOrders.length]
    );

    const reportCards = useMemo(
        () => [
            {
                title: "Inventory Health",
                icon: ChartBarIcon,
                stats: [
                    {
                        label: "In Stock",
                        value: dashboardStats?.inStockItems || 0,
                    },
                    {
                        label: "Out of Stock",
                        value: dashboardStats?.outOfStockItems || 0,
                    },
                    {
                        label: "Active Items",
                        value: dashboardStats?.activeItems || 0,
                    },
                    {
                        label: "Inactive Items",
                        value: dashboardStats?.inactiveItems || 0,
                    },
                ],
            },
            {
                title: "Stock Alerts",
                icon: ArrowTrendingDownIcon,
                stats: [
                    {
                        label: "Low Stock",
                        value: dashboardStats?.lowStockItems || 0,
                    },
                    {
                        label: "Critical",
                        value: dashboardStats?.outOfStockItems || 0,
                    },
                    {
                        label: "Reorder Threshold",
                        value: `${dashboardStats?.lowStockItems || 0} flagged`,
                    },
                    {
                        label: "Buffer Coverage",
                        value: `${dashboardStats?.minStockCoverage || 0} days`,
                    },
                ],
            },
            {
                title: "Orders Pulse",
                icon: ArrowTrendingUpIcon,
                stats: [
                    { label: "Recent Orders", value: recentOrders.length },
                    {
                        label: "Items Ordered",
                        value: recentOrderFigures.itemCount,
                    },
                    {
                        label: "Total Value",
                        value: formatCurrency(recentOrderFigures.totalAmount),
                    },
                    {
                        label: "Average Value",
                        value: formatCurrency(recentOrderFigures.avgAmount),
                    },
                ],
            },
        ],
        [dashboardStats, recentOrderFigures, recentOrders.length]
    );

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner size="lg" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div
                    className={`${cardClasses} relative overflow-hidden px-10 py-12`}
                >
                    <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.6em] text-slate-400">
                                Reports
                            </p>
                            <h1 className="mt-4 text-4xl font-semibold text-white">
                                Intelligence Hub
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300">
                                Observe real-time inventory momentum, understand
                                fulfillment pressure, and export snapshots for
                                stakeholders in seconds.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {highlightStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                                >
                                    <p className={labelClasses}>{stat.label}</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {stat.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {reportCards.map((card) => (
                        <div
                            key={card.title}
                            className={`${cardClasses} px-6 py-6`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                                        Segment
                                    </p>
                                    <h3 className="mt-1 text-xl font-semibold text-white">
                                        {card.title}
                                    </h3>
                                </div>
                                <card.icon className="h-10 w-10 text-slate-200" />
                            </div>
                            <dl className="mt-6 space-y-4">
                                {card.stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex items-center justify-between text-sm text-slate-200"
                                    >
                                        <dt className="text-slate-400">
                                            {stat.label}
                                        </dt>
                                        <dd className="font-semibold text-white">
                                            {stat.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    ))}
                </div>

                <div className={`${cardClasses} overflow-hidden px-0 py-0`}>
                    <div className="flex flex-wrap items-center justify-between border-b border-white/5 px-8 py-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                                Recent Orders
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">
                                Audit Trail
                            </p>
                        </div>
                        <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                            Last snapshot • {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        {recentOrders.length === 0 ? (
                            <div className="px-8 py-16 text-center text-slate-400">
                                No recent orders found.
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-white/5 text-sm text-slate-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-[0.4em] text-slate-500">
                                        {[
                                            "Order",
                                            "Items",
                                            "Total",
                                            "Status",
                                            "Date",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-8 py-5"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => {
                                        const status = ORDER_STATUS[
                                            order.status
                                        ] || {
                                            text: order.status,
                                            badgeClass:
                                                "bg-white/10 text-white",
                                        };
                                        return (
                                            <tr
                                                key={order.id}
                                                className="border-t border-white/5"
                                            >
                                                <td className="px-8 py-4 font-semibold text-white">
                                                    #{order.id}
                                                </td>
                                                <td className="px-8 py-4 text-slate-200">
                                                    {order.itemCount}
                                                </td>
                                                <td className="px-8 py-4 text-white">
                                                    {formatCurrency(
                                                        order.totalAmount
                                                    )}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-xs font-semibold ${status.badgeClass}`}
                                                    >
                                                        <span className="h-2 w-2 rounded-full bg-white"></span>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-slate-300">
                                                    {formatDateTime(
                                                        order.createdAt
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className={`${cardClasses} px-8 py-8`}>
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <p className={labelClasses}>Exports</p>
                            <h3 className="mt-2 text-2xl font-semibold text-white">
                                Shareable snapshots
                            </h3>
                            <p className="text-sm text-slate-300">
                                One-click exports for finance, ops, or vendor
                                syncs.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: "Inventory",
                                    action: () =>
                                        toast.info(
                                            "Inventory export coming soon"
                                        ),
                                },
                                {
                                    label: "Orders",
                                    action: () =>
                                        toast.info("Orders export coming soon"),
                                },
                                {
                                    label: "Full Report",
                                    action: () =>
                                        toast.info(
                                            "Report generation coming soon"
                                        ),
                                },
                            ].map((button) => (
                                <button
                                    key={button.label}
                                    onClick={button.action}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:border-sky-400"
                                >
                                    <CloudArrowDownIcon className="h-4 w-4" />
                                    {`Export ${button.label}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
