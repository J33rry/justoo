"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";
import {
    UserCircleIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    KeyIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

const labelClasses =
    "text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400";
const cardClasses =
    "rounded-3xl border border-white/5 bg-white/5 shadow-card shadow-black/30 backdrop-blur-2xl";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [savingPassword, setSavingPassword] = useState(false);

    const roleBadge = useMemo(() => {
        if (!user?.role)
            return { text: "User", classes: "bg-slate-500/20 text-slate-100" };
        return user.role === "admin"
            ? { text: "Admin", classes: "bg-sky-500/20 text-sky-100" }
            : { text: "User", classes: "bg-emerald-500/20 text-emerald-100" };
    }, [user?.role]);

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setSavingPassword(true);
        try {
            await authAPI.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success("Password updated successfully");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Password update error", error);
            const message =
                error.response?.data?.message || "Failed to update password";
            toast.error(message);
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <DashboardLayout>
            <section className="space-y-8">
                <div className={`${cardClasses} px-8 py-10`}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className={labelClasses}>Profile</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">
                                Your operator identity
                                <span className="ml-3 text-base font-normal text-slate-400">
                                    • last login{" "}
                                    {user?.lastLogin
                                        ? formatDateTime(user.lastLogin)
                                        : "not recorded"}
                                </span>
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300">
                                Review your contact footprint and keep your
                                password hygiene tight; reach out to an admin if
                                any account data needs to change.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
                            <p className="text-xs uppercase tracking-[0.4em]">
                                Role
                            </p>
                            <p className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white">
                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${roleBadge.classes}`}
                                >
                                    <ShieldCheckIcon className="h-4 w-4" />
                                    {roleBadge.text}
                                </span>
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                                Account created{" "}
                                {user?.createdAt
                                    ? formatDateTime(user.createdAt)
                                    : "date pending"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6">
                        <div className={`${cardClasses} p-6`}>
                            <div className="flex items-center gap-4">
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                    <UserCircleIcon className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                                        Operator
                                    </p>
                                    <h2 className="text-2xl font-semibold text-white">
                                        {user?.username || "Anonymous"}
                                    </h2>
                                    <p className="text-sm text-slate-300">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3 text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span>Account status</span>
                                    <span className="font-semibold text-emerald-300">
                                        {user?.isActive
                                            ? "Active"
                                            : "Suspended"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last login</span>
                                    <span>
                                        {user?.lastLogin
                                            ? formatDateTime(user.lastLogin)
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Created by</span>
                                    <span>
                                        {user?.createdBy
                                            ? `Admin #${user.createdBy}`
                                            : "System"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${cardClasses} p-5 text-sm text-slate-200`}
                        >
                            <p className={labelClasses}>Actions</p>
                            <h4 className="mt-2 text-xl font-semibold text-white">
                                Account controls
                            </h4>
                            <div className="mt-4 space-y-3">
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-white/40"
                                >
                                    Log out of this device
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-slate-300 transition hover:border-white/40"
                                    disabled
                                >
                                    Request account deletion (contact admin)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className={`${cardClasses} p-6`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={labelClasses}>Profile</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">
                                        Contact details
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {[
                                    {
                                        label: "Username",
                                        value: user?.username || "—",
                                        icon: UserCircleIcon,
                                    },
                                    {
                                        label: "Email",
                                        value: user?.email || "—",
                                        icon: EnvelopeIcon,
                                    },
                                ].map((field) => (
                                    <div
                                        key={field.label}
                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <field.icon className="h-5 w-5 text-slate-300" />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                                    {field.label}
                                                </p>
                                                <p className="text-lg font-semibold text-white">
                                                    {field.value}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            Managed by admin
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-slate-400">
                                Need to update these details? Ping an admin so
                                they can process the change centrally.
                            </p>
                        </div>

                        <div className={`${cardClasses} p-6`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={labelClasses}>Security</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">
                                        Change password
                                    </h3>
                                </div>
                            </div>
                            <form
                                className="mt-6 space-y-5"
                                onSubmit={handlePasswordSubmit}
                            >
                                <div>
                                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                        Current password
                                    </label>
                                    <div className="relative mt-2">
                                        <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            value={passwordForm.currentPassword}
                                            onChange={(event) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    currentPassword:
                                                        event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                            New password
                                        </label>
                                        <div className="relative mt-2">
                                            <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={passwordForm.newPassword}
                                                onChange={(event) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        newPassword:
                                                            event.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                                                placeholder="At least 6 characters"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                            Confirm password
                                        </label>
                                        <div className="relative mt-2">
                                            <CheckCircleIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={
                                                    passwordForm.confirmPassword
                                                }
                                                onChange={(event) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        confirmPassword:
                                                            event.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                                                placeholder="Repeat new password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
                                    <p className="flex items-center gap-2">
                                        <ShieldCheckIcon className="h-4 w-4 text-emerald-300" />
                                        Use at least one number and symbol for
                                        stronger security.
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
                                        Password changes log you out of other
                                        active sessions.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={savingPassword}
                                        className="inline-flex w-full items-center justify-center rounded-2xl border border-rose-400/40 bg-rose-500/20 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {savingPassword
                                            ? "Updating password…"
                                            : "Update password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}
