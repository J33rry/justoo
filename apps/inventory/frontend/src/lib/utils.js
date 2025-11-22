import { format } from "date-fns";

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
};

// Format date and time
export const formatDateTime = (date) => {
    return format(new Date(date), "MMM dd, yyyy HH:mm");
};

// Capitalize first letter
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const STOCK_BADGES = {
    red: {
        badge: "bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/20",
        dot: "bg-rose-400",
    },
    yellow: {
        badge: "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/20",
        dot: "bg-amber-400",
    },
    green: {
        badge: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/20",
        dot: "bg-emerald-400",
    },
};

// Get stock status
export const getStockStatus = (quantity, minStockLevel) => {
    let status = { status: "in", color: "green", text: "In Stock" };

    if (quantity === 0) {
        status = { status: "out", color: "red", text: "Out of Stock" };
    } else if (quantity <= minStockLevel) {
        status = { status: "low", color: "yellow", text: "Low Stock" };
    }

    return {
        ...status,
        badgeClass: STOCK_BADGES[status.color].badge,
        dotClass: STOCK_BADGES[status.color].dot,
    };
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Debounce function
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

// Units mapping
export const UNITS = {
    kg: "Kilogram",
    grams: "Grams",
    ml: "Milliliter",
    litre: "Liter",
    pieces: "Pieces",
    dozen: "Dozen",
    packet: "Packet",
    bottle: "Bottle",
    can: "Can",
};

// Role mapping
export const ROLES = {
    admin: "Administrator",
    viewer: "Viewer",
};

// Order status mapping
export const ORDER_STATUS = {
    placed: {
        text: "Placed",
        color: "blue",
        badgeClass: "bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/30",
    },
    cancelled: {
        text: "Cancelled",
        color: "red",
        badgeClass: "bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/30",
    },
    completed: {
        text: "Completed",
        color: "green",
        badgeClass:
            "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30",
    },
};
