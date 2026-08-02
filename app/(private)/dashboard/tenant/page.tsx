"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt } from "lucide-react";
import { toast } from "sonner";

import { RentalRequest } from "@/types/rental.type";
import { getMyRentalRequests } from "@/service/tenant.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TenantDashboard = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyRentalRequests();
        setRequests(data);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    active: requests.filter((r) => r.status === "ACTIVE").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  const recent = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-2 pt-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="overflow-hidden rounded-xl border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b p-4 last:border-none">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here is an overview of your rentals.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/tenant/payments/history">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment History
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Active Rentals", value: counts.active },
          { label: "Completed", value: counts.completed },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Receipt className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Payment History
              </h3>
              <p className="text-sm text-muted-foreground">
                View all your completed and pending payments.
              </p>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href="/dashboard/tenant/payments/history">
              View
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <Link
            href="/dashboard/tenant/requests"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            {recent.map((r, index) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-4 ${
                  index !== recent.length - 1 ? "border-b" : ""
                }`}
              >
                <div>
                  <p className="font-medium">
                    {r.property.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      r.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;