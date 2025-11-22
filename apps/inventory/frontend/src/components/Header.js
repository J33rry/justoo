"use client";

import { Bars3Icon, BellIcon, UserIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const badgeStyles = {
    admin: "text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20",
    viewer: "text-cyan-200 bg-cyan-500/10 ring-1 ring-cyan-400/20",
};

export default function Header({ setSidebarOpen, user }) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const userNavigation = [
        { name: "Your profile", href: "/dashboard/profile" },
        { name: "Sign out", onClick: handleLogout },
    ];

    const today = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    }).format(new Date());

    return (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-900/40 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex rounded-lg border border-white/10 p-2.5 text-slate-200 shadow-sm shadow-slate-900/30 transition hover:border-white/30 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div
                        className="hidden h-10 w-px bg-white/5 lg:block"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Today • {today}
                        </p>
                        <h1 className="text-xl font-semibold text-white">
                            Inventory Command Center
                        </h1>
                        <p className="text-sm text-slate-400">
                            Monitor stock, orders, and alerts in one glance.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="relative inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-100 transition hover:border-white/30"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                    </button>

                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-1.5 py-1 pr-3 text-left text-sm text-white transition hover:border-white/30">
                            <span className="sr-only">Open user menu</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-purple-500 shadow-lg shadow-primary-500/40">
                                <UserIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="hidden text-left lg:block">
                                <p className="text-sm font-semibold capitalize">
                                    {user?.username}
                                </p>
                                <span
                                    className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        badgeStyles[user?.role] ||
                                        "text-slate-200 bg-white/10 ring-1 ring-white/15"
                                    }`}
                                >
                                    {user?.role}
                                </span>
                            </div>
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute right-0 z-50 mt-3 w-44 origin-top-right rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-sm text-slate-200 shadow-2xl shadow-black/40 backdrop-blur-xl data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            {userNavigation.map((item) => (
                                <MenuItem key={item.name}>
                                    {({ focus }) =>
                                        item.onClick ? (
                                            <button
                                                onClick={item.onClick}
                                                className={`flex w-full items-center rounded-xl px-3 py-2 text-left transition ${
                                                    focus
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-200"
                                                }`}
                                            >
                                                {item.name}
                                            </button>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className={`block rounded-xl px-3 py-2 transition ${
                                                    focus
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-200"
                                                }`}
                                            >
                                                {item.name}
                                            </a>
                                        )
                                    }
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </header>
    );
}
