"use client";

import { Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    HomeIcon,
    CubeIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Inventory", href: "/dashboard/inventory", icon: CubeIcon },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCartIcon },
    { name: "Reports", href: "/dashboard/reports", icon: ChartBarIcon },
];

const navClasses = (isActive) =>
    `${
        isActive
            ? "text-white shadow-[0_0_20px_rgba(14,165,233,0.25)] bg-gradient-to-r from-white/10 to-transparent border-white/30"
            : "text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/5"
    } border border-transparent flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition`;

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentPath }) {
    const { user } = useAuth();

    const SidebarContent = () => (
        <div className="glass-panel flex grow flex-col gap-y-6 overflow-y-auto px-6 pb-6 pt-8 text-slate-100">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-primary-400 via-sky-400 to-purple-500 p-[1px]">
                    <div className="rounded-2xl bg-slate-950/80 p-2">
                        <CubeIcon className="h-6 w-6 text-slate-100" />
                    </div>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Justoo
                    </p>
                    <h2 className="text-lg font-semibold text-white">
                        Inventory HQ
                    </h2>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-6">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={navClasses(isActive)}
                            >
                                <item.icon
                                    className={`${
                                        isActive
                                            ? "text-sky-300"
                                            : "text-slate-400"
                                    } h-5 w-5`}
                                />
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-sky-300"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600">
                            <UserIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold capitalize">
                                {user?.username}
                            </p>
                            <p className="text-xs text-slate-400">
                                {user?.role} access
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );

    return (
        <>
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-950/80" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex">
                        <TransitionChild
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 rounded-full border border-white/20 p-2.5 text-white"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <SidebarContent />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <SidebarContent />
            </div>
        </>
    );
}
