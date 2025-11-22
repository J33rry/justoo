/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#0b1a4a",
                },
                midnight: {
                    50: "#f4f7ff",
                    100: "#e5e9ff",
                    200: "#c4cdff",
                    300: "#8aa0ff",
                    400: "#5c79ff",
                    500: "#344bff",
                    600: "#2432cc",
                    700: "#1c2899",
                    800: "#151d66",
                    900: "#0c123d",
                },
                slate: {
                    950: "#070812",
                },
            },
            fontFamily: {
                sans: [
                    "var(--font-geist-sans)",
                    "Inter",
                    "system-ui",
                    "sans-serif",
                ],
                mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "glow-card":
                    "radial-gradient(circle at top, rgba(79,70,229,0.35), transparent 55%)",
                "mesh-gradient":
                    "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 35%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.2), transparent 45%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.2), transparent 40%)",
                grid: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            },
            backgroundSize: {
                grid: "40px 40px",
            },
            boxShadow: {
                glow: "0 20px 45px -20px rgba(56, 189, 248, 0.45)",
                card: "0 15px 40px rgba(15,23,42,0.18)",
            },
            borderRadius: {
                xl: "1.25rem",
            },
        },
    },
    plugins: [],
};
