"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { savedService } from "@/service/savedService";
import { Property } from "@/types/property";
import PropertyCard from "@/app/(public)/properties/_component/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedHomesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await savedService.getSavedProperties();
        if (res.success) setProperties(res.data ?? []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load saved homes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved Homes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Properties you have bookmarked for later.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
          <Heart className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved homes yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart icon on any property to save it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}