export const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    price: (Math.random() * 20 + 1).toFixed(2),
    quantity: Math.floor(Math.random() * 200 + 1),
    discount: (Math.random() * 0.2).toFixed(2),
    unit: [
        "kg",
        "grams",
        "ml",
        "litre",
        "pieces",
        "dozen",
        "packet",
        "bottle",
        "can",
    ][i % 9],
    description: `Description for item ${i + 1}`,
    minStockLevel: Math.floor(Math.random() * 20 + 1),
    category: ["Fruit", "Dairy", "Bakery", "Beverage", "Snack"][i % 5],
    isActive: 1,
    createdAt: `2025-09-${((i % 28) + 1)
        .toString()
        .padStart(2, "0")}T10:00:00Z`,
    updatedAt: `2025-09-08T10:00:00Z`,
}));
