import express from "express";
import {
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login); // POST /api/auth/login
router.post("/logout", logout); // POST /api/auth/logout

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile); // GET /api/auth/profile
router.put("/profile", authenticateToken, updateProfile); // PUT /api/auth/profile
router.put("/change-password", authenticateToken, changePassword); // PUT /api/auth/change-password

export default router;
