// app/dashboard/layout.tsx

import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="min-h-screen">
            {/* Dashboard Sidebar */}
            <aside>
                Sidebar
            </aside>

            {/* Dashboard Content */}
            <main>
                {children}
            </main>
        </div>
    );
}