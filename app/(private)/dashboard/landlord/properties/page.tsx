"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    MapPin,
    Pencil,
    Plus,
    Ruler,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { landlordService } from "@/service/landlordService";
import { cn } from "@/app/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";



// Matches generated/prisma/enums.ts PropertyStatus (only AVAILABLE | UNAVAILABLE exist)
type PropertyStatus = "AVAILABLE" | "UNAVAILABLE";

interface Property {
    id: string;
    title: string;
    location: string | null;
    city: string;
    state: string;
    price: string | number;
    bedrooms: number | null;
    bathrooms: number | null;
    sqft: number | null;
    images: string[];
    status: PropertyStatus;
    category?: { id: string; name: string };
}

const statusStyles: Record<PropertyStatus, string> = {
    AVAILABLE: "bg-blue-100 text-blue-700",
    UNAVAILABLE: "bg-gray-100 text-gray-700",
};

const formatPrice = (price: string | number) => {
    const value = typeof price === "string" ? Number(price) : price;
    return `$${value.toLocaleString()}/month`;
};

const LandlordProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadProperties = async () => {
        setLoading(true);
        setError(null);

        try {
            const json = await landlordService.getMyProperties();

            if (!json?.success) {
                throw new Error(json?.message ?? "Failed to load properties");
            }

            setProperties(json.data ?? []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const handleDelete = async (id: string) => {
        setDeletingId(id);

        try {
            const json = await landlordService.deleteProperty(id);

            if (!json?.success) {
                throw new Error(
                    json?.message ?? "Failed to delete property"
                );
            }

            setProperties((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setDeletingId(null);
        }
    };

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
                        My Properties
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {loading
                            ? "Loading your listings..."
                            : `${properties.length} ${properties.length === 1
                                ? "property"
                                : "properties"
                            } listed`}
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

            {loading ? (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="space-y-3 pt-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-2 pt-1">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 flex-1" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
) : properties.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No properties yet</p>
                        <p className="text-sm text-muted-foreground">
                            List your first property to start renting it out.
                        </p>
                        <Button asChild size="sm" className="mt-2">
                            <Link href="/dashboard/landlord/properties/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Property
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                            <div className="flex h-40 items-center justify-center bg-muted">
                                {property.images?.[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Building2 className="h-10 w-10 text-muted-foreground" />
                                )}
                            </div>

                            <CardContent className="space-y-3 pt-4">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="truncate font-medium">
                                        {property.title}
                                    </p>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[property.status]
                                            }`}
                                    >
                                        {property.status}
                                    </span>
                                </div>

                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                        {property.location ??
                                            `${property.city}, ${property.state}`}
                                    </span>
                                </p>

                                {property.category?.name && (
                                    <p className="text-xs text-muted-foreground">
                                        {property.category.name}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {property.bedrooms != null && (
                                        <span className="flex items-center gap-1">
                                            <Bed className="h-3.5 w-3.5" />
                                            {property.bedrooms}
                                        </span>
                                    )}
                                    {property.bathrooms != null && (
                                        <span className="flex items-center gap-1">
                                            <Bath className="h-3.5 w-3.5" />
                                            {property.bathrooms}
                                        </span>
                                    )}
                                    {property.sqft != null && (
                                        <span className="flex items-center gap-1">
                                            <Ruler className="h-3.5 w-3.5" />
                                            {property.sqft} sqft
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm font-semibold">
                                    {formatPrice(property.price)}
                                </p>

                                <div className="flex gap-2 pt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link
                                            href={`/dashboard/landlord/properties/${property.id}/edit`}
                                        >
                                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                            Edit
                                        </Link>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "sm",
                                                }),
                                                "flex-1 text-destructive hover:text-destructive"
                                            )}
                                            disabled={deletingId === property.id}
                                        >
                                            Delete
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete this property?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently
                                                    remove &ldquo;
                                                    {property.title}&rdquo;
                                                    and cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={() =>
                                                        handleDelete(
                                                            property.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LandlordProperties;