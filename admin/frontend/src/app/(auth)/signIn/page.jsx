"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

function SignInPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [testUsers, setTestUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showTestUsers, setShowTestUsers] = useState(false);

    const { login, user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, authLoading, router]);

    // Fetch test users on component mount
    useEffect(() => {
        fetchTestUsers();
    }, []);

    const fetchTestUsers = async () => {
        try {
            const response = await fetch("/api/auth/test-users");
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setTestUsers(data.data.users);
                }
            }
        } catch (error) {
            console.error("Error fetching test users:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(formData.username, formData.password);

        if (!result.success) {
            setError(result.message || "Sign in failed");
        }

        setLoading(false);
    };

    const handleTestUserClick = (user) => {
        setFormData({
            username: user.username,
            password: "password123",
        });
    };

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to Admin Panel
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your credentials to access the admin dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                {/* Test Users Section */}
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={() => setShowTestUsers(!showTestUsers)}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {showTestUsers ? "Hide" : "Show"} Test Users
                    </button>

                    {showTestUsers && testUsers.length > 0 && (
                        <div className="mt-4 bg-gray-100 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Available Test Users:
                            </h3>
                            <div className="space-y-2">
                                {testUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-3 rounded border cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={() =>
                                            handleTestUserClick(user)
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role ===
                                                        "super_admin"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Password: password123
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2">
                                            Click to auto-fill credentials
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                These test users are available in development
                                mode only
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
