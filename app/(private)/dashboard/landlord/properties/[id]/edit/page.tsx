"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";


import PropertyForm, { PropertyFormInitialData } from "../../_component/PropertyForm";
import { landlordService } from "@/service/landlordService";

const PropertyUpdatePage = () => {
    const params = useParams<{ id: string }>();
    const propertyId = params.id;

    const [property, setProperty] = useState<PropertyFormInitialData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            setError(null);

            try {
                // NOTE: assumes landlordService.getProperty(id) exists.
                // If not, add something like:
                //   getProperty: async (id: string) =>
                //     apiClient(`/landlord/properties/${id}`),
                const json = await landlordService.getProperty(propertyId);

                if (!json?.success) {
                    throw new Error(json?.message ?? "Failed to load property");
                }

                setProperty(json.data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) loadProperty();
    }, [propertyId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading property...
            </div>
        );
    }

    if (error || !property) {
        return (
            <p className="text-sm font-medium text-destructive">
                {error ?? "Property not found"}
            </p>
        );
    }

    return (
        <PropertyForm mode="edit" propertyId={propertyId} initialData={property} />
    );
};

export default PropertyUpdatePage;