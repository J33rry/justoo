"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: "🏠" },
        { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
        { href: "/dashboard/items", label: "Items", icon: "📦" },
        { href: "/dashboard/orders", label: "Orders", icon: "🛒" },
        { href: "/dashboard/riders", label: "Riders", icon: "🏍️" },
        { href: "/dashboard/users", label: "Users", icon: "👥" },
    ];

    return (
        <aside className="w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-screen shadow-2xl border-r border-slate-700 fixed left-0 top-0 z-10">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">J</span>
                    </div>
                    <span className="text-white font-bold text-xl">
                        Justoo Admin
                    </span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                                            : "text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105"
                                    }
                                `}
                            >
                                <span className="text-xl group-hover:animate-pulse">
                                    {item.icon}
                                </span>
                                <span className="font-medium">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">🚀</span>
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">
                                    System Status
                                </p>
                                <p className="text-green-400 text-xs">
                                    All systems operational
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
