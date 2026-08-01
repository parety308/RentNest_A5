"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Loader2,
    Mail,
    MapPin,
    XCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Adjust to match your actual API base url / client setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

interface RentalRequest {
    id: string;
    message: string | null;
    status: RequestStatus;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    property: {
        id: string;
        title: string;
        location: string | null;
        city: string;
        price: string | number;
    };
    tenant: {
        id: string;
        name: string;
        email: string;
    };
}

const statusStyles: Record<RequestStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const LandlordRequest = () => {
    const [requests, setRequests] = useState<RentalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"ALL" | RequestStatus>("ALL");

    const loadRequests = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/landlord/requests`, {
                credentials: "include",
            });
            const json = await res.json();

            if (!res.ok || !json?.success) {
                throw new Error(
                    json?.message ?? "Failed to load rental requests"
                );
            }

            setRequests(json.data ?? []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleDecision = async (
        id: string,
        status: "APPROVED" | "REJECTED"
    ) => {
        setActioningId(id);

        try {
            const res = await fetch(
                `${API_BASE_URL}/landlord/requests/${id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status }),
                }
            );

            const json = await res.json();

            if (!res.ok || !json?.success) {
                throw new Error(json?.message ?? "Failed to update request");
            }

            setRequests((prev) =>
                prev.map((request) =>
                    request.id === id ? { ...request, status } : request
                )
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setActioningId(null);
        }
    };

    const filteredRequests =
        filter === "ALL"
            ? requests
            : requests.filter((request) => request.status === filter);

    const filters: { label: string; value: "ALL" | RequestStatus }[] = [
        { label: "All", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/landlord"
                        className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Rental Requests
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Review and respond to tenant applications.
                    </p>
                </div>

                <div className="flex gap-2">
                    {filters.map((item) => (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={
                                filter === item.value ? "default" : "outline"
                            }
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="text-sm font-medium text-destructive">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading requests...
                </div>
            ) : filteredRequests.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                        <p className="font-medium">No requests here</p>
                        <p className="text-sm text-muted-foreground">
                            {filter === "ALL"
                                ? "You don't have any rental requests yet."
                                : `You don't have any ${filter.toLowerCase()} requests.`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <Card key={request.id}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <CardTitle className="text-base">
                                        {request.property.title}
                                    </CardTitle>

                                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {request.property.location ??
                                            request.property.city}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                        statusStyles[request.status]
                                    }`}
                                >
                                    {request.status}
                                </span>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="font-medium">
                                            {request.tenant.name}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            {request.tenant.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-muted-foreground sm:justify-end">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(request.startDate)} —{" "}
                                        {formatDate(request.endDate)}
                                    </div>
                                </div>

                                {request.message && (
                                    <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                                        {request.message}
                                    </p>
                                )}

                                {request.status === "PENDING" && (
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={
                                                actioningId === request.id
                                            }
                                            onClick={() =>
                                                handleDecision(
                                                    request.id,
                                                    "REJECTED"
                                                )
                                            }
                                        >
                                            <XCircle className="mr-1.5 h-4 w-4" />
                                            Reject
                                        </Button>

                                        <Button
                                            size="sm"
                                            disabled={
                                                actioningId === request.id
                                            }
                                            onClick={() =>
                                                handleDecision(
                                                    request.id,
                                                    "APPROVED"
                                                )
                                            }
                                        >
                                            {actioningId === request.id ? (
                                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                            )}
                                            Approve
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LandlordRequest;