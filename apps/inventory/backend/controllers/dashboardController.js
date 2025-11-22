import { db } from "../db/index.js";
import { items as itemTable } from "@justoo/db";
import { eq, sql, and, gt, lte } from "drizzle-orm";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalItems,
            activeItems,
            inactiveItems,
            inStockItems,
            outOfStockItems,
            lowStockItems,
            totalValue,
        ] = await Promise.all([
            // All items irrespective of status
            db.select({ count: sql`count(*)` }).from(itemTable),

            // Active items
            db
                .select({ count: sql`count(*)` })
                .from(itemTable)
                .where(eq(itemTable.isActive, 1)),

            // Inactive items
            db
                .select({ count: sql`count(*)` })
                .from(itemTable)
                .where(eq(itemTable.isActive, 0)),

            // In stock active items
            db
                .select({ count: sql`count(*)` })
                .from(itemTable)
                .where(
                    and(eq(itemTable.isActive, 1), gt(itemTable.quantity, 0))
                ),

            // Out of stock active items
            db
                .select({ count: sql`count(*)` })
                .from(itemTable)
                .where(
                    and(eq(itemTable.isActive, 1), eq(itemTable.quantity, 0))
                ),

            // Low stock active items (above zero but at/below threshold)
            db
                .select({ count: sql`count(*)` })
                .from(itemTable)
                .where(
                    and(
                        eq(itemTable.isActive, 1),
                        gt(itemTable.quantity, 0),
                        lte(itemTable.quantity, itemTable.minStockLevel)
                    )
                ),

            // Total inventory value (active items only)
            db
                .select({
                    value: sql`COALESCE(SUM(CAST(${itemTable.price} AS DECIMAL) * ${itemTable.quantity}), 0)`,
                })
                .from(itemTable)
                .where(eq(itemTable.isActive, 1)),
        ]);

        const countValue = (result) => Number(result?.[0]?.count ?? 0);
        const inventoryValue = Number(totalValue?.[0]?.value ?? 0);

        res.json({
            success: true,
            data: {
                totalItems: countValue(totalItems),
                activeItems: countValue(activeItems),
                inactiveItems: countValue(inactiveItems),
                inStockItems: countValue(inStockItems),
                outOfStockItems: countValue(outOfStockItems),
                lowStockItems: countValue(lowStockItems),
                totalValue: inventoryValue,
                totalInventoryValue: inventoryValue,
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
