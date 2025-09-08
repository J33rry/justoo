export const payments = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    order_id: i + 1,
    amount: Number((Math.random() * 100 + 10).toFixed(2)),
    method: ["Credit Card", "Cash", "UPI", "Net Banking"][i % 4],
    status: ["completed", "pending", "failed"][i % 3],
    created_at: `2025-09-${((i % 28) + 1)
        .toString()
        .padStart(2, "0")}T09:30:00Z`,
}));
