"use client";

import { useEffect, useState } from "react";
import {
    Building2,
    ClipboardList,
    Home,
    Users,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { adminService } from "@/service/adminService";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    isBanned?: boolean;
}

interface Property {
    id: string;
    title?: string;
    status?: string;
    available?: boolean;
}

interface Rental {
    id: string;
    status?: string;
    tenant?: {
        name?: string;
    };
    property?: {
        id?: string;
        title?: string;
    };
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0); // FIX: comes from meta.total, not users.length
    const [properties, setProperties] = useState<Property[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [usersResponse, propertiesResponse, rentalsResponse] =
                    await Promise.all([
                        adminService.getAllUsers(),
                        adminService.getAllProperties(),
                        adminService.getAllRentals(),
                    ]);

                const usersList: User[] = Array.isArray(usersResponse)
                    ? usersResponse
                    : usersResponse?.data?.data || [];

                const usersTotal: number = Array.isArray(usersResponse)
                    ? usersResponse.length
                    : usersResponse?.data?.meta?.total ?? usersList.length;

                setUsers(usersList);
                setTotalUsers(usersTotal);

                setProperties(
                    Array.isArray(propertiesResponse)
                        ? propertiesResponse
                        : propertiesResponse?.data || []
                );

                setRentals(
                    Array.isArray(rentalsResponse)
                        ? rentalsResponse
                        : rentalsResponse?.data || []
                );
            } catch (error) {
                console.error("Failed to load admin dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);



    const totalProperties = properties.length;

    const pendingRentals = rentals.filter(
        (rental) => rental.status?.toLowerCase() === "pending"
    ).length;

    const activeRentals = rentals.filter((rental) =>
        ["approved", "active", "rented"].includes(
            rental.status?.toLowerCase() || ""
        )
    ).length;

    const stats = [
        {
            title: "Total Users",
            value: totalUsers,
            description: "Registered users",
            icon: Users,
        },
        {
            title: "Total Properties",
            value: totalProperties,
            description: "Listed properties",
            icon: Building2,
        },
        {
            title: "Rental Requests",
            value: pendingRentals,
            description: "Pending requests",
            icon: ClipboardList,
        },
        {
            title: "Active Rentals",
            value: activeRentals,
            description: "Currently rented",
            icon: Home,
        },
    ];


    const recentRentals = [...rentals].slice(0, 5);


    const availableProperties = properties.filter(
        // FIX: Prisma field is "available", "isAvailable" never existed
        (property) =>
            property.available === true ||
            property.status?.toLowerCase() === "available"
    ).length;

    const rentedPropertyIds = new Set(
        rentals
            .filter((r) => (r.status || "").toUpperCase() === "COMPLETED")
            .map((r) => r.property?.id)
            .filter(Boolean)
    );

    const pendingPropertyIds = new Set(
        rentals
            .filter((r) => (r.status || "").toUpperCase() === "PENDING")
            .map((r) => r.property?.id)
            .filter(Boolean)
    );

    const rentedProperties = rentedPropertyIds.size;
    const pendingProperties = pendingPropertyIds.size;

    const propertyTotal = properties.length || 1;

    const availablePercentage = (availableProperties / propertyTotal) * 100;

    const rentedPercentage = (rentedProperties / propertyTotal) * 100;

    const pendingPercentage = (pendingProperties / propertyTotal) * 100;

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-7 w-12" />
                                <Skeleton className="h-3 w-28" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
                            <CardContent className="space-y-4">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your RentNest platform.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>

                                <Icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Rental Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Rental Requests</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {recentRentals.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No rental requests found.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentRentals.map((rental) => {
                                    const status =
                                        rental.status?.toLowerCase() ||
                                        "pending";

                                    return (
                                        <div
                                            key={rental.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {rental.tenant?.name ||
                                                        "Unknown User"}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {rental.property?.title ||
                                                        "Unknown Property"}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : status === "approved" ||
                                                            status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {rental.status || "Pending"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Property Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Overview</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            {/* Available */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Available</span>

                                    <span className="font-semibold">
                                        {availableProperties}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{
                                            width: `${Math.min(
                                                availablePercentage,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Rented */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Rented</span>

                                    <span className="font-semibold">
                                        {rentedProperties}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{
                                            width: `${Math.min(
                                                rentedPercentage,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Pending */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        Pending Approval
                                    </span>

                                    <span className="font-semibold">
                                        {pendingProperties}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{
                                            width: `${Math.min(
                                                pendingPercentage,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;