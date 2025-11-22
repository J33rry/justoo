"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { inventoryAPI } from "@/lib/api";
import { formatCurrency, getStockStatus, UNITS } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
    PlusIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";

export default function InventoryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const router = useRouter();

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                sortBy,
                sortOrder,
                ...(filter !== "all" && { stockStatus: filter }),
            };

            const response = await inventoryAPI.getAllItems(params);
            setItems(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch inventory items");
            console.error("Fetch items error:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, sortBy, sortOrder]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await inventoryAPI.deleteItem(id);
            toast.success("Item deleted successfully");
            fetchItems();
        } catch (error) {
            toast.error("Failed to delete item");
            console.error("Delete item error:", error);
        }
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "all") return matchesSearch;

        const quantity = Number(item.quantity) || 0;
        const minStock = Number(item.minStockLevel) || 0;

        let matchesStock = true;
        if (filter === "in-stock") {
            matchesStock = quantity > 0;
        } else if (filter === "out-of-stock") {
            matchesStock = quantity === 0;
        } else if (filter === "low-stock") {
            matchesStock = quantity > 0 && quantity <= minStock;
        }

        return matchesSearch && matchesStock;
    });

    const handleRowClick = (id) => {
        router.push(`/dashboard/inventory/${id}`);
    };

    return (
        <DashboardLayout>
            <section className="space-y-8">
                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/40 backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            Inventory
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">
                            Your live stockroom
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Monitor stock levels, pricing, and availability in
                            real time.
                        </p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/dashboard/inventory/add"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-sky-500/20 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-sky-500/30 sm:mt-0"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add item
                        </Link>
                    )}
                </div>

                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card shadow-black/30 backdrop-blur-xl">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <label
                                htmlFor="search"
                                className="text-xs uppercase tracking-[0.3em] text-slate-400"
                            >
                                Search
                            </label>
                            <div className="relative mt-2">
                                <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Find by name or category"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Stock status
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                            >
                                <option value="all">All items</option>
                                <option value="in-stock">In stock</option>
                                <option value="low-stock">Low stock</option>
                                <option value="out-of-stock">
                                    Out of stock
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Sort by
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                            >
                                <option value="name">Name</option>
                                <option value="category">Category</option>
                                <option value="price">Price</option>
                                <option value="quantity">Quantity</option>
                                <option value="createdAt">Date created</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Order
                            </label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-slate-900/30 shadow-card shadow-black/40 backdrop-blur-2xl">
                    {loading ? (
                        <div className="py-16">
                            <LoadingSkeleton />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="px-6 py-16 text-center text-slate-300">
                            No items match the criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
                                <thead>
                                    <tr className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left"
                                        >
                                            Item
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left"
                                        >
                                            Category
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left"
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left"
                                        >
                                            Stock
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-right"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredItems.map((item) => {
                                        const stockStatus = getStockStatus(
                                            item.quantity,
                                            item.minStockLevel
                                        );
                                        return (
                                            <tr
                                                key={item.id}
                                                onClick={() =>
                                                    handleRowClick(item.id)
                                                }
                                                className="cursor-pointer hover:bg-white/5"
                                            >
                                                <td className="px-6 py-5 align-top">
                                                    <p className="font-semibold text-white">
                                                        {item.name}
                                                    </p>
                                                    {item.description && (
                                                        <p className="mt-1 text-sm text-slate-400 line-clamp-2 max-w-md">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 align-top text-slate-300">
                                                    {item.category || "-"}
                                                </td>
                                                <td className="px-6 py-5 align-top text-slate-100">
                                                    <div className="font-semibold">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </div>
                                                    {item.discount > 0 && (
                                                        <p className="text-xs text-emerald-300">
                                                            {item.discount}% off
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 align-top text-slate-200">
                                                    <div className="font-semibold">
                                                        {item.quantity}{" "}
                                                        {UNITS[item.unit] ||
                                                            item.unit}
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        Min:{" "}
                                                        {item.minStockLevel}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 align-top">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.badgeClass}`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${stockStatus.dotClass}`}
                                                        ></span>
                                                        {stockStatus.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    {isAdmin && (
                                                        <button
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                handleDelete(
                                                                    item.id
                                                                );
                                                            }}
                                                            className="rounded-full border border-white/10 p-2 text-rose-200 transition hover:border-rose-400/60 hover:text-white"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
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
            </section>
        </DashboardLayout>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white"></div>
        </div>
    );
}
