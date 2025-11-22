"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";

const inputClasses =
    "w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const isDev = process.env.NODE_ENV !== "production";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data.username, data.password);
            toast.success("Welcome back");
            router.push("/dashboard");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            setError("root", { message });
        } finally {
            setIsLoading(false);
        }
    };
    const devSandbox = {
        id: "admin // viewer",
        password: "admin123 // viewer123",
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
                <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-sky-500/30 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(2,132,199,0.25),_transparent_55%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 39.5h40v1H0zM39.5 0v40h1V0z\' fill=\'rgba(148,163,184,0.1)\'/%3E%3C/svg%3E')] opacity-40" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
                <div className="glass-panel w-full max-w-3xl space-y-8 p-8 lg:p-10">
                    <div className="space-y-4 text-center">
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                            Inventory HQ
                        </div>
                        <h1 className="text-4xl font-semibold text-white">
                            Precision-grade inventory access
                        </h1>
                        <p className="text-sm text-slate-400">
                            Sign in with the credentials issued by your admin
                            team. During development you can also use the
                            sandbox auth bundle below.
                        </p>
                    </div>

                    {isDev && (
                        <div className="rounded-3xl border border-dashed border-sky-400/40 bg-sky-500/10 p-5 text-sm text-slate-200">
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
                                Developer sandbox
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                                        ID
                                    </p>
                                    <p className="mt-1 font-mono text-sm text-white">
                                        {devSandbox.id}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                                        Password
                                    </p>
                                    <p className="mt-1 font-mono text-sm text-white">
                                        {devSandbox.password}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-slate-400">
                                Use this only in local/dev environments.
                                Production access is provisioned per operator.
                            </p>
                        </div>
                    )}

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Username must be at least 3 characters",
                                        },
                                    })}
                                    type="text"
                                    autoComplete="username"
                                    placeholder="ops.supervisor"
                                    className={inputClasses}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-rose-300">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={inputClasses}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-rose-300">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {errors.root && (
                            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                                {errors.root.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-400/50 bg-gradient-to-r from-sky-500/30 via-cyan-500/30 to-blue-600/30 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(14,165,233,0.25)] transition hover:border-sky-300 hover:shadow-[0_0_35px_rgba(14,165,233,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                                    Authenticating…
                                </>
                            ) : (
                                "Launch session"
                            )}
                        </button>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                            <div className="inline-flex items-center gap-2 text-slate-300">
                                <LockClosedIcon className="h-4 w-4 text-sky-300" />
                                Managed by Justoo Platform Ops
                            </div>
                            <p>Problems signing in? ping ops@justoo.app</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
