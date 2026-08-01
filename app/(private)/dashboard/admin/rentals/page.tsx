"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { adminService } from "@/service/adminService";

interface Rental {
    id: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    tenant?: {
        name?: string;
        email?: string;
    };
    property?: {
        title?: string;
        city?: string;
    };
}

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function statusBadgeClass(status: string) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "approved":
        case "active":
            return "bg-green-100 text-green-700";
        case "rejected":
            return "bg-red-100 text-red-700";
        default:
            return "bg-muted text-muted-foreground";
    }
}

const AllRentals = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    useEffect(() => {
        const loadRentals = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await adminService.getAllRentals();

                // Backend wraps as { success, message, data: RentalRequest[] }
                const list: Rental[] = Array.isArray(response)
                    ? response
                    : response?.data || [];

                setRentals(list);
            } catch (err) {
                console.error("Failed to load rentals:", err);
                setError("Couldn't load rental requests. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadRentals();
    }, []);

    const filteredRentals = useMemo(() => {
        if (statusFilter === "ALL") return rentals;

        return rentals.filter(
            (rental) =>
                (rental.status || "").toUpperCase() === statusFilter
        );
    }, [rentals, statusFilter]);

    const counts = useMemo(() => {
        return STATUS_FILTERS.reduce<Record<string, number>>((acc, key) => {
            acc[key] =
                key === "ALL"
                    ? rentals.length
                    : rentals.filter(
                          (r) => (r.status || "").toUpperCase() === key
                      ).length;
            return acc;
        }, {});
    }, [rentals]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Rental Requests
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {rentals.length} total{" "}
                        {rentals.length === 1 ? "request" : "requests"}
                    </p>
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                statusFilter === status
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                            }`}
                        >
                            {status.charAt(0) + status.slice(1).toLowerCase()}{" "}
                            <span className="opacity-70">
                                ({counts[status] ?? 0})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Requests</CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex min-h-50 items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Loading rental requests...
                            </p>
                        </div>
                    ) : filteredRentals.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No rental requests found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="pb-3 font-medium">
                                            Tenant
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Property
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Requested
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Move-in
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {filteredRentals.map((rental) => {
                                        const status = (
                                            rental.status || "pending"
                                        ).toLowerCase();

                                        return (
                                            <tr key={rental.id}>
                                                <td className="py-3">
                                                    <p className="font-medium">
                                                        {rental.tenant
                                                            ?.name ||
                                                            "Unknown User"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {rental.tenant
                                                            ?.email || ""}
                                                    </p>
                                                </td>

                                                <td className="py-3">
                                                    <p className="font-medium">
                                                        {rental.property
                                                            ?.title ||
                                                            "Unknown Property"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {rental.property
                                                            ?.city || ""}
                                                    </p>
                                                </td>

                                                <td className="py-3 text-muted-foreground">
                                                    {formatDate(
                                                        rental.createdAt
                                                    )}
                                                </td>

                                                <td className="py-3 text-muted-foreground">
                                                    {formatDate(
                                                        rental.startDate
                                                    )}
                                                </td>

                                                <td className="py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {rental.status ||
                                                            "Pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AllRentals;