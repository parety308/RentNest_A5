"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { RentalRequest } from "@/types/rental.type";
import { getMyActiveRentals } from "@/service/tenant.service";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#16523D]/10 text-[#16523D]",
  COMPLETED: "bg-gray-100 text-gray-600",
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyActiveRentals();
        setRentals(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load rentals");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading your rentals…</div>;
  }

  if (rentals.length === 0) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-semibold">No active rentals yet</h2>
        <p className="text-muted-foreground mt-1">
          Once a rental request is approved and paid, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">My Rentals</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((rental) => (
          <Link
            key={rental.id}
            href={`/tenant/rentals/${rental.id}`}
            className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 w-full bg-muted">
              {rental.property.images?.[0] && (
                <Image
                  src={rental.property.images[0]}
                  alt={rental.property.title}
                  fill
                  className="object-cover"
                />
              )}
              <span
                className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[rental.status]}`}
              >
                {rental.status}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-medium truncate">{rental.property.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {rental.property.address}, {rental.property.city}
              </p>
              <p className="text-sm font-semibold text-[#16523D]">
                ${rental.property.price.toLocaleString()}/mo
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;