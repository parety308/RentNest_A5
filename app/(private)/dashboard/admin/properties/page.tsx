"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adminService } from "@/service/adminService";
import { cn } from "@/lib/utils";

type PropertyStatus = "AVAILABLE" | "UNAVAILABLE";

interface Property {
    id: string;
    title: string;
    city: string;
    state: string;
    price: number;
    status: PropertyStatus;
    category?: { id: string; name: string };
    landlord?: {
        id: string;
        name: string;
        email: string;
    };
}

const STATUS_FILTERS = ["ALL", "AVAILABLE", "UNAVAILABLE"];

const statusStyles: Record<PropertyStatus, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    UNAVAILABLE: "bg-gray-100 text-gray-700",
};

const AdminProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [actioningId, setActioningId] = useState<string | null>(null);

    const loadProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminService.getAllProperties();

            const list: Property[] = Array.isArray(response)
                ? response
                : response?.data || [];

            setProperties(list);
        } catch (err) {
            console.error("Failed to load properties:", err);
            setError("Couldn't load properties. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        if (statusFilter === "ALL") return properties;
        return properties.filter((p) => p.status === statusFilter);
    }, [properties, statusFilter]);

    const counts = useMemo(() => {
        return STATUS_FILTERS.reduce<Record<string, number>>((acc, key) => {
            acc[key] =
                key === "ALL"
                    ? properties.length
                    : properties.filter((p) => p.status === key).length;
            return acc;
        }, {});
    }, [properties]);

    const handleToggleStatus = async (property: Property) => {
        const nextStatus: PropertyStatus =
            property.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";

        setActioningId(property.id);

        try {
            const json = await adminService.updatePropertyStatus(
                property.id,
                { status: nextStatus }
            );

            if (!json?.success) {
                throw new Error(json?.message ?? "Failed to update status");
            }

            setProperties((prev) =>
                prev.map((p) =>
                    p.id === property.id ? { ...p, status: nextStatus } : p
                )
            );

            toast.success(
                nextStatus === "UNAVAILABLE"
                    ? "Listing taken down"
                    : "Listing restored"
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
        } finally {
            setActioningId(null);
        }
    };

    const handleDelete = async (id: string) => {
        setActioningId(id);

        try {
            const json = await adminService.deleteProperty(id);

            if (!json?.success) {
                throw new Error(json?.message ?? "Failed to delete property");
            }

            setProperties((prev) => prev.filter((p) => p.id !== id));
            toast.success("Listing deleted");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
        } finally {
            setActioningId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Properties
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {properties.length} total{" "}
                        {properties.length === 1 ? "listing" : "listings"}
                    </p>
                </div>

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
                    <CardTitle>Listings</CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="pb-3 font-medium">Property</th>
                                        <th className="pb-3 font-medium">Landlord</th>
                                        <th className="pb-3 font-medium">Location</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="py-3"><Skeleton className="h-4 w-32" /></td>
                                            <td className="py-3 space-y-1.5">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </td>
                                            <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                                            <td className="py-3"><Skeleton className="h-4 w-16" /></td>
                                            <td className="py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                            <td className="py-3 text-right"><Skeleton className="ml-auto h-7 w-24 rounded-lg" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                            <Building2 className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                No properties found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="pb-3 font-medium">Property</th>
                                        <th className="pb-3 font-medium">Landlord</th>
                                        <th className="pb-3 font-medium">Location</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {filteredProperties.map((property) => (
                                        <tr key={property.id}>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {property.title}
                                                    </p>
                                                    <Link
                                                        href={`/properties/${property.id}`}
                                                        target="_blank"
                                                        className="text-muted-foreground hover:text-foreground"
                                                        aria-label="View public listing"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                                {property.category?.name && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {property.category.name}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-3">
                                                <p className="font-medium">
                                                    {property.landlord?.name ?? "Unknown"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {property.landlord?.email ?? ""}
                                                </p>
                                            </td>

                                            <td className="py-3 text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {property.city}, {property.state}
                                                </span>
                                            </td>

                                            <td className="py-3 font-medium">
                                                ${property.price.toLocaleString()}
                                            </td>

                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[property.status]}`}
                                                >
                                                    {property.status}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={actioningId === property.id}
                                                        onClick={() => handleToggleStatus(property)}
                                                    >
                                                        {property.status === "AVAILABLE"
                                                            ? "Take Down"
                                                            : "Restore"}
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            className={cn(
                                                                buttonVariants({
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                }),
                                                                "text-destructive hover:text-destructive"
                                                            )}
                                                            disabled={actioningId === property.id}
                                                        >
                                                            Delete
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete this listing?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently remove
                                                                    &ldquo;{property.title}&rdquo; and
                                                                    all related rental requests. This
                                                                    cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    onClick={() =>
                                                                        handleDelete(property.id)
                                                                    }
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProperties;