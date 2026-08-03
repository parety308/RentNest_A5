"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { RentalRequest } from "@/types/rental.type";
import { getMyActiveRentals } from "@/service/tenant.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ReviewForm from "./_component/ReviewForm";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#16523D]/10 text-[#16523D]",
  COMPLETED: "bg-gray-100 text-gray-600",
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

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
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        {rentals.map((rental) => {
          const isCompleted = rental.status === "COMPLETED";
          const hasReviewed = reviewedIds.has(rental.id);
          const isReviewOpen = openReviewId === rental.id;

          return (
            <div
              key={rental.id}
              className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/tenant/rentals/${rental.id}`}>
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
              </Link>

              <div className="p-4 space-y-1">
                <h3 className="font-medium truncate">{rental.property.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {rental.property.address}, {rental.property.city}
                </p>
                <p className="text-sm font-semibold text-[#16523D]">
                  ${rental.property.price.toLocaleString()}/mo
                </p>

                {isCompleted && (
                  <div className="pt-2">
                    {hasReviewed ? (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        Review submitted
                      </p>
                    ) : !isReviewOpen ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenReviewId(rental.id)}
                      >
                        <Star className="mr-1.5 h-4 w-4" />
                        Leave a Review
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>

              {isCompleted && isReviewOpen && (
                <div className="px-4 pb-4">
                  <ReviewForm
                    propertyId={rental.property.id}
                    onCancel={() => setOpenReviewId(null)}
                    onSubmitted={() => {
                      setReviewedIds((prev) => new Set(prev).add(rental.id));
                      setOpenReviewId(null);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRentals;