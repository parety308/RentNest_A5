"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    BarChart3,
    Building2,
    ClipboardList,
    CreditCard,
    Home,
    LogOut,
    Menu,
    Settings,
    Users,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import logout from "@/service/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TENANT" | "LANDLORD";
}

interface DashboardShellProps {
    children: ReactNode;
    user: User;
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navigation: Record<User["role"], NavItem[]> = {
    ADMIN: [
        {
            label: "Overview",
            href: "/dashboard/admin",
            icon: BarChart3,
        },
        {
            label: "Users",
            href: "/dashboard/admin/users",
            icon: Users,
        },
        {
            label: "Rental Requests",
            href: "/dashboard/admin/rentals",
            icon: ClipboardList,
        }
    ],

    TENANT: [
        {
            label: "Overview",
            href: "/dashboard/tenant",
            icon: BarChart3,
        },
        {
            label: "Browse Properties",
            href: "/properties",
            icon: Building2,
        },
        {
            label: "My Rentals",
            href: "/dashboard/tenant/rentals",
            icon: Home,
        },
        {
            label: "Rental Requests",
            href: "/dashboard/tenant/requests",
            icon: ClipboardList,
        },
        { label: "Payment History", href: "/dashboard/tenant/payment/history", icon: CreditCard },
       
    ],

    LANDLORD: [
        {
            label: "Overview",
            href: "/dashboard/landlord",
            icon: BarChart3,
        },
        {
            label: "My Properties",
            href: "/dashboard/landlord/properties",
            icon: Building2,
        },
        {
            label: "Add Property",
            href: "/dashboard/landlord/properties/create",
            icon: Home,
        },
        {
            label: "Rental Requests",
            href: "/dashboard/landlord/requests",
            icon: ClipboardList,
        },
       
    ],
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function formatRole(role: User["role"]) {
    return role.charAt(0) + role.slice(1).toLowerCase();
}

export default function DashboardShell({
    children,
    user,
}: DashboardShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
        toast("Logged out");
    };
    const navItems = navigation[user.role];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-72 flex-col
                    border-r bg-background
                    transition-transform duration-300
                    lg:translate-x-0
                    ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <span className="text-xl font-bold">
                            RentNest
                        </span>
                    </Link>

                    {/* Mobile Close */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* User Profile */}
                <div className="border-b p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                                {user.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </p>

                            <p className="mt-0.5 text-xs font-medium text-primary">
                                {formatRole(user.role)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Menu
                    </p>

                    {navItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 rounded-lg
                                    px-3 py-2.5 text-sm font-medium
                                    transition-colors
                                    ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }
                                `}
                            >
                                <Icon className="h-5 w-5 shrink-0" />

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Link>

                    <button
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div>
                            <h1 className="text-lg font-semibold">
                                {formatRole(user.role)} Dashboard
                            </h1>

                            <p className="hidden text-xs text-muted-foreground sm:block">
                                Manage your RentNest account
                            </p>
                        </div>
                    </div>

                    {/* Header Profile */}
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">
                                {user.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {formatRole(user.role)}
                            </p>
                        </div>

                        <Avatar>
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

