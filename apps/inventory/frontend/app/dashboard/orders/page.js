"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { orderAPI } from "@/lib/api";
import { formatCurrency, formatDateTime, ORDER_STATUS } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    SparklesIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const labelClasses =
    "text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400";
const cardClasses =
    "rounded-3xl border border-white/5 bg-white/5 shadow-card shadow-black/30 backdrop-blur-2xl";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                ...(statusFilter !== "all" && { status: statusFilter }),
            };

            const response = await orderAPI.getAllOrders(params);
            setOrders(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                order.id.toString().includes(searchTerm) ||
                order.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const summary = useMemo(() => {
        const totalValue = orders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0
        );
        const completed = orders.filter(
            (order) => order.status === "delivered"
        ).length;
        const cancelled = orders.filter(
            (order) => order.status === "cancelled"
        ).length;
        const avgValue = orders.length ? totalValue / orders.length : 0;

        return {
            total: orders.length,
            totalValue,
            avgValue,
            completed,
            cancelled,
        };
    }, [orders]);

    const statusOptions = [
        { value: "all", label: "All Orders" },
        { value: "placed", label: "Placed" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const handleRowClick = (order) => {
        setSelectedOrder(order);
    };

    const closeDetails = () => setSelectedOrder(null);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className={`${cardClasses} px-8 py-10`}>
                    <p className="text-xs uppercase tracking-[0.6em] text-slate-400">
                        Operations
                    </p>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-semibold text-white">
                                Orders Command Center
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300">
                                Track order momentum, flag bottlenecks, and keep
                                fulfillment aligned with inventory in real time.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-slate-300">
                            <p className="font-semibold text-white">
                                {user?.name || "Team Member"}
                            </p>
                            <p>
                                {user?.role ? user.role.toUpperCase() : "ADMIN"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {[
                        {
                            label: "Total Orders",
                            value: summary.total,
                            accent: "from-sky-500/70 to-blue-500/40",
                            chip: "+12% vs last week",
                        },
                        {
                            label: "Gross Volume",
                            value: formatCurrency(summary.totalValue),
                            accent: "from-emerald-500/70 to-teal-500/40",
                            chip: "Realtime",
                        },
                        {
                            label: "Average Order",
                            value: formatCurrency(summary.avgValue),
                            accent: "from-indigo-500/70 to-purple-500/40",
                            chip: "Updated",
                        },
                        {
                            label: "Fulfillment Rate",
                            value: `${
                                summary.total
                                    ? Math.round(
                                          (summary.completed / summary.total) *
                                              100
                                      )
                                    : 0
                            }%`,
                            accent: "from-amber-500/70 to-orange-500/40",
                            chip: `${summary.cancelled} cancelled`,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`${cardClasses} px-6 py-6`}
                        >
                            <div className="flex items-center justify-between">
                                <p className={labelClasses}>{stat.label}</p>
                                {/* <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-slate-200">
                                    {stat.chip}
                                </span> */}
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-white">
                                {stat.value}
                            </p>
                            <div
                                className={`mt-4 h-2 rounded-full bg-gradient-to-r ${stat.accent}`}
                            ></div>
                        </div>
                    ))}
                </div>

                <div className={`${cardClasses} px-8 py-8`}>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex-1 space-y-2">
                            <p className={labelClasses}>Search Orders</p>
                            <div className="relative">
                                <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by order ID or notes"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className={labelClasses}>Status Filter</p>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter(option.value)
                                        }
                                        className={`rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                                            statusFilter === option.value
                                                ? "border-sky-400 bg-sky-500/10 text-white"
                                                : "border-white/10 text-slate-300 hover:border-white/30"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchOrders}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400"
                        >
                            <ArrowPathIcon className="h-4 w-4" /> Refresh
                        </button>
                    </div>
                </div>

                <div className={`${cardClasses} overflow-hidden px-0 py-0`}>
                    <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
                                Order Stream
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">
                                Live Transactions
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-100">
                            <SparklesIcon className="h-4 w-4" /> Updated{" "}
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-4 px-8 py-10">
                            {[...Array(4)].map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="h-16 rounded-2xl border border-white/5 bg-white/5 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="px-8 py-16 text-center text-slate-400">
                            No orders found for the current filters.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5 text-sm text-slate-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-[0.4em] text-slate-500">
                                        {[
                                            "Order",
                                            "Created",
                                            "Items",
                                            "Total",
                                            "Status",
                                            "Notes",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-8 py-5"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
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
                                                onClick={() =>
                                                    handleRowClick(order)
                                                }
                                                className="cursor-pointer border-t border-white/5 transition hover:bg-white/5"
                                            >
                                                <td className="px-8 py-4 font-semibold text-white">
                                                    #{order.id}
                                                </td>
                                                <td className="px-8 py-4 text-slate-300">
                                                    {formatDateTime(
                                                        order.createdAt
                                                    )}
                                                </td>
                                                <td className="px-8 py-4 text-slate-200">
                                                    {order.itemCount} items
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
                                                    {order.notes ? (
                                                        <span className="line-clamp-2 text-sm text-slate-200">
                                                            {order.notes}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={closeDetails}
                />
            </div>
        </DashboardLayout>
    );
}

function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    const status = ORDER_STATUS[order.status] || {
        text: order.status,
        badgeClass: "bg-white/10 text-white",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                            Order detail
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">
                            #{order.id}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Placed {formatDateTime(order.createdAt)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-white/40 hover:text-white"
                        aria-label="Close order details"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className={labelClasses}>Summary</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-200">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Status</span>
                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClass}`}
                                >
                                    <span className="h-2 w-2 rounded-full bg-white"></span>
                                    {status.text}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Items</span>
                                <span className="font-semibold text-white">
                                    {order.itemCount} items
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">
                                    Total amount
                                </span>
                                <span className="text-lg font-semibold text-white">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Updated</span>
                                <span>
                                    {order.updatedAt
                                        ? formatDateTime(order.updatedAt)
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className={labelClasses}>Notes</p>
                        <p className="mt-4 text-sm text-slate-200">
                            {order.notes || "No notes shared."}
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10">
                    <div className="border-b border-white/10 px-5 py-4">
                        <p className={labelClasses}>Line items</p>
                    </div>
                    <div className="divide-y divide-white/10">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                                <div
                                    key={`${item.id || item.name}-${index}`}
                                    className="grid grid-cols-1 gap-4 px-5 py-4 text-sm text-slate-200 md:grid-cols-4"
                                >
                                    <div className="font-semibold text-white">
                                        {item.name ||
                                            item.itemName ||
                                            `Item ${index + 1}`}
                                    </div>
                                    <div>
                                        Qty: {item.quantity || item.qty || 0}
                                    </div>
                                    <div>
                                        {item.unit || item.unitLabel || ""}
                                    </div>
                                    <div className="text-right font-semibold text-white">
                                        {item.total
                                            ? formatCurrency(item.total)
                                            : item.price
                                            ? formatCurrency(
                                                  item.price *
                                                      (item.quantity || 1)
                                              )
                                            : "—"}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-6 text-sm text-slate-400">
                                No line items available for this order.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
