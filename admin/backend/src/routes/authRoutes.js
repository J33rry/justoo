import express from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { testUserService, testUsers } from "../config/testUsers.js";

const router = express.Router();

// Public routes
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

// Development route to list test users (only in development)
if (process.env.NODE_ENV !== "production") {
    router.get("/test-users", (req, res) => {
        const users = testUsers.map((user) => ({
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }));
        res.json({
            success: true,
            message: "Test users retrieved successfully",
            data: { users },
        });
    });
}

// Protected routes (require authentication)
router.get("/me", authMiddleware, authController.getMe);
router.post("/refresh", authMiddleware, authController.refreshToken);

export default router;
