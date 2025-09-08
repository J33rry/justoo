import Link from "next/link";
import React from "react";

const Sidebar = () => {
    return (
        <aside
            style={{
                width: "220px",
                background: "#fff",
                height: "100vh",
                padding: "2rem 1rem",
                boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
            }}
        >
            <nav>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard/analytics"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Analytics
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard/orders"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Orders
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard/riders"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Riders
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard/items"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Items
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                        <Link
                            href="/dashboard/users"
                            style={{
                                color: "#111",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                display: "block",
                                transition: "background 0.2s",
                            }}
                        >
                            Users
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
