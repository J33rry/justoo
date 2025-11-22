"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { inventoryAPI } from "@/lib/api";
import { UNITS } from "@/lib/utils";
import toast from "react-hot-toast";

const labelClasses =
    "text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400";
const inputClasses =
    "block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none";
const cardClasses =
    "rounded-3xl border border-white/5 bg-white/5 shadow-card shadow-black/30 backdrop-blur-2xl";

export default function EditItemPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();
    const params = useParams();
    const itemId = params.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: "",
            quantity: "",
            minStockLevel: 10,
            discount: 0,
            unit: "pieces",
            category: "",
            isActive: 1,
        },
    });

    useEffect(() => {
        const loadItem = async () => {
            try {
                setIsLoading(true);
                const response = await inventoryAPI.getItemById(itemId);
                const itemData = response.data.data;
                setItem(itemData);

                if (itemData.image) {
                    setImagePreview(itemData.image);
                }

                reset({
                    name: itemData.name || "",
                    description: itemData.description || "",
                    price: itemData.price || "",
                    quantity: itemData.quantity || "",
                    minStockLevel: itemData.minStockLevel || 10,
                    discount: itemData.discount || 0,
                    unit: itemData.unit || "pieces",
                    category: itemData.category || "",
                    isActive: itemData.isActive || 1,
                });
            } catch (error) {
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
    }, [itemId, reset, router]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (item?.image && !selectedImage) {
            setImagePreview(null);
        } else {
            setImagePreview(item?.image || null);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    formData.append(key, value);
                }
            });

            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            await inventoryAPI.updateItem(itemId, formData);
            toast.success("Item updated successfully!");
            router.push("/dashboard/inventory");
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update item";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-96 items-center justify-center">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }

    if (!item) {
        return (
            <DashboardLayout>
                <div className={`${cardClasses} px-10 py-12 text-center`}>
                    <p className="text-xs uppercase tracking-[0.6em] text-slate-400">
                        Inventory
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold text-white">
                        Item not found
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                        The item you&apos;re trying to edit could not be
                        located.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/inventory")}
                        className="mt-6 inline-flex items-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-glow"
                    >
                        Back to Inventory
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className={`${cardClasses} px-8 py-10`}>
                    <p className="text-xs uppercase tracking-[0.6em] text-slate-400">
                        Editing
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold text-white">
                        {item.name}
                    </h1>
                    <p className="mt-3 text-sm text-slate-300 max-w-2xl">
                        Adjust pricing, quantities, reorder points, and imagery
                        to keep your inventory source-of-truth aligned with
                        what&apos;s on shelves.
                    </p>
                </div>

                <div className={`${cardClasses} px-8 py-10`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="lg:col-span-2 space-y-3">
                                <p className={labelClasses}>Item Name *</p>
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Item name is required",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "Name must be at least 2 characters",
                                        },
                                    })}
                                    className={inputClasses}
                                    placeholder="E.g. Organic Cold Brew"
                                />
                                {errors.name && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>Category</p>
                                <input
                                    type="text"
                                    {...register("category")}
                                    className={inputClasses}
                                    placeholder="Beverages"
                                />
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>Unit *</p>
                                <select
                                    {...register("unit", {
                                        required: "Unit is required",
                                    })}
                                    className={`${inputClasses} pr-10`}
                                >
                                    {Object.entries(UNITS).map(
                                        ([value, label]) => (
                                            <option
                                                key={value}
                                                value={value}
                                                className="bg-slate-900"
                                            >
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                                {errors.unit && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.unit.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>Price *</p>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        {...register("price", {
                                            required: "Price is required",
                                            min: {
                                                value: 0,
                                                message:
                                                    "Price must be positive",
                                            },
                                        })}
                                        className={`${inputClasses} pl-9`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>Discount (%)</p>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        {...register("discount", {
                                            min: {
                                                value: 0,
                                                message:
                                                    "Discount cannot be negative",
                                            },
                                            max: {
                                                value: 100,
                                                message:
                                                    "Discount cannot exceed 100%",
                                            },
                                        })}
                                        className={inputClasses}
                                        placeholder="0.00"
                                    />
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        %
                                    </span>
                                </div>
                                {errors.discount && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.discount.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>
                                    Current Quantity *
                                </p>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("quantity", {
                                        required: "Quantity is required",
                                        min: {
                                            value: 0,
                                            message:
                                                "Quantity cannot be negative",
                                        },
                                    })}
                                    className={inputClasses}
                                    placeholder="0"
                                />
                                {errors.quantity && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.quantity.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>
                                    Minimum Stock Level *
                                </p>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("minStockLevel", {
                                        required:
                                            "Minimum stock level is required",
                                        min: {
                                            value: 0,
                                            message:
                                                "Minimum stock level cannot be negative",
                                        },
                                    })}
                                    className={inputClasses}
                                    placeholder="10"
                                />
                                {errors.minStockLevel && (
                                    <p className="text-sm font-medium text-rose-300">
                                        {errors.minStockLevel.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className={labelClasses}>Status</p>
                                <select
                                    {...register("isActive")}
                                    className={`${inputClasses} pr-10`}
                                >
                                    <option value="1" className="bg-slate-900">
                                        Active
                                    </option>
                                    <option value="0" className="bg-slate-900">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className={labelClasses}>Description</p>
                            <textarea
                                rows="4"
                                {...register("description")}
                                className={`${inputClasses} resize-none`}
                                placeholder="Tasting notes, sourcing info, prep instructions, etc."
                            ></textarea>
                        </div>

                        <div className="space-y-4">
                            <p className={labelClasses}>Item Image</p>
                            <div className="flex flex-wrap items-center gap-6">
                                {imagePreview ? (
                                    <div className="relative">
                                        <Image
                                            src={imagePreview}
                                            alt="Item preview"
                                            width={112}
                                            height={112}
                                            unoptimized
                                            className="h-28 w-28 rounded-2xl border border-white/10 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                                        >
                                            ×
                                        </button>
                                        {item?.image && !selectedImage && (
                                            <span className="absolute -bottom-2 left-0 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                                                Current
                                            </span>
                                        )}
                                        {selectedImage && (
                                            <span className="absolute -bottom-2 left-0 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                                                New
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-28 w-28 rounded-2xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl" />
                                )}

                                <label
                                    htmlFor="image-upload"
                                    className="flex cursor-pointer flex-col rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left text-sm text-slate-200 shadow-glow transition hover:border-sky-400"
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <span className="font-semibold">
                                        Upload Image
                                    </span>
                                    <span className="mt-1 text-xs text-slate-400">
                                        PNG, JPG, or GIF up to 5MB
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-4 border-t border-white/5 pt-8">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard/inventory")
                                }
                                className="inline-flex items-center rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-xl disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Update Item"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
