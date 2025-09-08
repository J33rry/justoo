export const riders = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    username: `rider${i + 1}`,
    email: `rider${i + 1}@example.com`,
    password: `hashedpassword${i + 1}`,
    phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: ["active", "inactive", "suspended"][i % 3],
    isActive: i % 2,
    lastLogin: `2025-09-${((i % 28) + 1)
        .toString()
        .padStart(2, "0")}T08:00:00Z`,
    createdAt: `2025-09-${((i % 28) + 1)
        .toString()
        .padStart(2, "0")}T08:00:00Z`,
    updatedAt: "2025-09-08T08:00:00Z",
}));
