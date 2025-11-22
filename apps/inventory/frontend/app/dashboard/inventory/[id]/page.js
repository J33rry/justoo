"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { inventoryAPI } from "@/lib/api";
import { formatCurrency, getStockStatus, UNITS } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ItemDetailPage() {
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const itemId = params.id;
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadItem = async () => {
            try {
                setIsLoading(true);
                const response = await inventoryAPI.getItemById(itemId);
                setItem(response.data.data);
            } catch (error) {
                console.error("Error loading item:", error);
                const message =
                    error.response?.data?.message || "Failed to load item";
                toast.error(message);
                router.push("/dashboard/inventory");
            } finally {
                setIsLoading(false);
            }
        };

        if (itemId) {
            loadItem();
        }
    }, [itemId, router]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await inventoryAPI.deleteItem(itemId);
            toast.success("Item deleted successfully");
            router.push("/dashboard/inventory");
        } catch (error) {
            toast.error("Failed to delete item");
            console.error("Delete item error:", error);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }

    if (!item) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">
                        Item not found
                    </h3>
                    <p className="text-slate-400 mb-4">
                        The item you&apos;re looking for could not be found.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/inventory")}
                        className="inline-flex items-center gap-2 rounded-2xl border border-sky-500/30 bg-sky-500/20 px-5 py-3 text-sm font-semibold text-white"
                    >
                        Back to inventory
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const stockStatus = getStockStatus(item.quantity, item.minStockLevel);

    return (
        <DashboardLayout>
            <section className="space-y-8">
                <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/40 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
                    <div>
                        <button
                            onClick={() => router.push("/dashboard/inventory")}
                            className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                        >
                            <ArrowLeftIcon className="h-4 w-4" /> Back to
                            inventory
                        </button>
                        <h1 className="mt-3 text-3xl font-semibold text-white">
                            {item.name}
                        </h1>
                        <p className="text-sm text-slate-400">#{item.id}</p>
                    </div>
                    {isAdmin && (
                        <div className="flex gap-3">
                            <Link
                                href={`/dashboard/inventory/edit/${item.id}`}
                                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
                            >
                                <PencilIcon className="mr-2 inline h-4 w-4" />{" "}
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                            >
                                <TrashIcon className="mr-2 inline h-4 w-4" />{" "}
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/30 backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            Basics
                        </p>
                        <div className="mt-4 space-y-4 text-sm text-slate-200">
                            <div>
                                <p className="text-slate-400">Category</p>
                                <p className="text-white">
                                    {item.category || "Uncategorized"}
                                </p>
                            </div>
                            {item.description && (
                                <div>
                                    <p className="text-slate-400">
                                        Description
                                    </p>
                                    <p className="text-white">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-slate-400">Status</p>
                                <span
                                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                        item.isActive
                                            ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30"
                                            : "bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/30"
                                    }`}
                                >
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/30 backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            Pricing & Stock
                        </p>
                        <div className="mt-4 space-y-4 text-sm text-slate-200">
                            <div>
                                <p className="text-slate-400">Unit price</p>
                                <p className="text-2xl font-semibold text-white">
                                    {formatCurrency(item.price)}
                                    {item.discount > 0 && (
                                        <span className="ml-2 text-sm text-emerald-300">
                                            ({item.discount}% discount)
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400">Current stock</p>
                                <div className="mt-1 flex items-center gap-3 text-white">
                                    <span className="text-xl font-semibold">
                                        {item.quantity}{" "}
                                        {UNITS[item.unit] || item.unit}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.badgeClass}`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${stockStatus.dotClass}`}
                                        ></span>
                                        {stockStatus.text}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400">
                                    Minimum stock level
                                </p>
                                <p className="text-white">
                                    {item.minStockLevel}{" "}
                                    {UNITS[item.unit] || item.unit}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400">Total value</p>
                                <p className="text-xl font-semibold text-white">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/30 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Record information
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-slate-200 sm:grid-cols-2">
                        <div>
                            <p className="text-slate-400">Created</p>
                            <p className="text-white">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400">Last updated</p>
                            <p className="text-white">
                                {new Date(item.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}
