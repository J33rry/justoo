// Auth Controller
import { findByUsername } from "../utils/db.js";
import {
    comparePassword,
    generateToken,
    extractTokenFromHeader,
} from "../utils/auth.js";
import {
    unauthorizedResponse,
    errorResponse,
    successResponse,
} from "../utils/response.js";
import admin from "../models/admin.js";
import { testUserService } from "../config/testUsers.js";

export const signin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return errorResponse(res, "Username and password are required", 400);
    }

    try {
        // First check test users
        const testUser =
            testUserService.findByUsername(username) ||
            testUserService.findByEmail(username);

        if (testUser) {
            // Handle test user authentication
            if (!testUser.isActive) {
                return unauthorizedResponse(res, "Account is deactivated");
            }

            const isValidPassword = await testUserService.validatePassword(
                password,
                testUser.password
            );

            if (!isValidPassword) {
                return unauthorizedResponse(
                    res,
                    "Invalid username or password"
                );
            }

            // Update last login (in memory)
            testUser.lastLogin = new Date();

            // Generate JWT token
            const token = generateToken({
                id: testUser.id,
                username: testUser.username,
                userType: "test_admin",
                role: testUser.role,
                isTestUser: true,
            });

            // Set httpOnly cookie for session
            res.cookie("auth_token", token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            return successResponse(
                res,
                {
                    user: {
                        id: testUser.id,
                        username: testUser.username,
                        email: testUser.email,
                        role: testUser.role,
                        userType: "test_admin",
                        isTestUser: true,
                    },
                },
                "Test admin signed in successfully"
            );
        }

        // If not a test user, proceed with regular database authentication
        let user = await findByUsername(admin, username);
        let tableName = "admin";

        if (!user) {
            return unauthorizedResponse(res, "Invalid username or password");
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return unauthorizedResponse(res, "Invalid username or password");
        }

        const token = generateToken({
            id: user.id,
            username: user.username,
            userType: tableName,
            role: user.role,
        });

        // Set httpOnly cookie for session
        res.cookie("auth_token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return successResponse(
            res,
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    userType: tableName,
                },
            },
            "Signed in successfully"
        );
    } catch (error) {
        console.error("Error signing in:", error);
        return errorResponse(res, "Error signing in");
    }
};

export const signout = (req, res) => {
    res.clearCookie("auth_token");
    return successResponse(res, null, "Signed out successfully");
};

export const getMe = async (req, res) => {
    try {
        const user = req.user;
        // console.log("Authenticated user:", user);

        // If it's a test user, return test user data
        if (user.isTestUser) {
            const testUser = testUserService.findById(user.id);
            if (!testUser || !testUser.isActive) {
                return unauthorizedResponse(
                    res,
                    "Test user not found or inactive"
                );
            }

            return successResponse(
                res,
                {
                    user: {
                        id: testUser.id,
                        username: testUser.username,
                        email: testUser.email,
                        role: testUser.role,
                        userType: "test_admin",
                        isTestUser: true,
                        lastLogin: testUser.lastLogin,
                    },
                },
                "Test user info retrieved successfully"
            );
        }

        // Regular database user
        return successResponse(
            res,
            { user: { ...user } },
            "User info retrieved successfully"
        );
    } catch (error) {
        console.error("Error getting user info:", error);
        return errorResponse(res, "Error retrieving user info");
    }
};

export const refreshToken = async (req, res) => {
    try {
        const user = req.user;

        // Generate new token
        const newToken = generateToken({
            id: user.id,
            username: user.username,
            role: user.role,
            userType: user.userType,
            isTestUser: user.isTestUser || false,
        });

        // Set new cookie
        res.cookie("auth_token", newToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return successResponse(res, null, "Token refreshed successfully");
    } catch (error) {
        console.error("Error refreshing token:", error);
        return errorResponse(res, "Error refreshing token");
    }
};
