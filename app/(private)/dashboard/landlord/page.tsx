"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Building2,
    ClipboardList,
    Clock3,
    Loader2,
    Plus,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { landlordService } from "@/service/landlordService";
import { Skeleton } from "@/components/ui/skeleton";



interface Property {
    id: string;
    title: string;
    status: "AVAILABLE" | "UNAVAILABLE";
    price: string | number;
}

interface RentalRequest {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    property: { title: string };
    tenant: { name: string };
    createdAt: string;
}

const LandlordDashboard = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [requests, setRequests] = useState<RentalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const [propertiesRes, requestsRes] = await Promise.all([
                    landlordService.getMyProperties(),
                    landlordService.getAllRentalRequests(),
                ]);

                if (!propertiesRes?.success) {
                    throw new Error(
                        propertiesRes?.message ??
                            "Failed to load properties"
                    );
                }
                if (!requestsRes?.success) {
                    throw new Error(
                        requestsRes?.message ??
                            "Failed to load rental requests"
                    );
                }

                setProperties(propertiesRes.data ?? []);
                setRequests(requestsRes.data ?? []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const pendingRequests = requests.filter((r) => r.status === "PENDING");
    const availableCount = properties.filter(
        (p) => p.status === "AVAILABLE"
    ).length;

    if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-10" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Landlord Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Overview of your listings and rental requests.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/dashboard/landlord/properties/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                    </Link>
                </Button>
            </div>

            {error && (
                <p className="text-sm font-medium text-destructive">
                    {error}
                </p>
            )}

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Building2 className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {properties.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Total Properties
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <ClipboardList className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {availableCount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Available Listings
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                            <Clock3 className="h-5 w-5 text-yellow-700" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {pendingRequests.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Pending Requests
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent rental requests */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                        Recent Rental Requests
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/landlord/requests">
                            View All
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No rental requests yet.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {requests.slice(0, 5).map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between py-3 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {request.property.title}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {request.tenant.name}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                        {request.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent properties */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                        My Properties
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/landlord/properties">
                            View All
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {properties.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            You haven&apos;t listed any properties yet.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {properties.slice(0, 5).map((property) => (
                                <div
                                    key={property.id}
                                    className="flex items-center justify-between py-3 text-sm"
                                >
                                    <p className="font-medium">
                                        {property.title}
                                    </p>
                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                        {property.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LandlordDashboard;