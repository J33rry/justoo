export const orders = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    userId: 100 + (i % 10),
    status: ["placed", "delivered", "cancelled", "processing"][i % 4],
    totalAmount: Number((Math.random() * 100 + 10).toFixed(2)),
    itemCount: Math.floor(Math.random() * 5 + 1),
    notes: `Order note ${i + 1}`,
    createdAt: `2025-09-${((i % 28) + 1)
        .toString()
        .padStart(2, "0")}T09:00:00Z`,
    updatedAt: `2025-09-08T09:00:00Z`,
    items: Array.from(
        { length: Math.floor(Math.random() * 3 + 1) },
        (_, j) => ({
            itemId: j + 1,
            itemName: `Item ${j + 1}`,
            quantity: Math.floor(Math.random() * 10 + 1),
            unitPrice: Number((Math.random() * 20 + 1).toFixed(2)),
            totalPrice: Number((Math.random() * 50 + 1).toFixed(2)),
            unit: ["kg", "litre", "pieces"][j % 3],
        })
    ),
}));
