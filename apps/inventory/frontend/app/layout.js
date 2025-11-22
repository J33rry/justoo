import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Inventory Management System",
    description: "Instant delivery platform inventory management",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-50 bg-slate-950`}
            >
                <div className="relative min-h-screen overflow-hidden">
                    <div className="pointer-events-none fixed inset-0 -z-20 bg-mesh-gradient opacity-70" />
                    <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-10" />
                    <div className="pointer-events-none fixed inset-0 -z-10 bg-noise" />
                    <AuthProvider>
                        <div className="relative z-0">
                            {children}
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: "#0f172a",
                                        color: "#f8fafc",
                                    },
                                }}
                            />
                        </div>
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
