import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: 30,
                }}
            >
                <Sidebar />
            </div>
            <div
                className="flex-1 flex flex-col"
                style={{ minHeight: "100vh" }}
            >
                <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
                    <Navbar />
                </div>
                <div style={{ flex: 1, overflowY: "auto", height: "100%" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
