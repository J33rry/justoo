import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            <Sidebar />
            <div className="min-h-screen">
                <Navbar />
                <main className="ml-64 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
