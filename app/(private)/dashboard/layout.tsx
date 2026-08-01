
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";
import DashboardShell from "./_component/DashboardShell";


interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const user = await getMe();

    // Not authenticated
    if (!user?.success || !user?.data) {
        redirect("/auth/login");
    }

    return (
        <DashboardShell user={user.data}>
            {children}
        </DashboardShell>
    );
}
