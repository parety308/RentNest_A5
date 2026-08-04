"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt } from "lucide-react";

import { RentalRequest } from "@/types/rental.type";
import { getMyRentalRequests } from "@/service/tenant.service";
import { paymentService } from "@/service/paymentService";
import { useApiErrorHandler } from "@/service/useApiErrorHandler";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  provider: "STRIPE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt: string | null;
  createdAt: string;
  rentalRequest: {
    id: string;
    property?: {
      title: string;
    };
  };
}

const statusVariant = {
  PENDING: "secondary",
  COMPLETED: "default",
  FAILED: "destructive",
} as const;

const TenantDashboard = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const handleApiError = useApiErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        const [requestsData, paymentsRes] = await Promise.all([
          getMyRentalRequests(),
          paymentService.getPaymentHistory(),
        ]);

        setRequests(requestsData);

        if (paymentsRes?.success) {
          setPayments(paymentsRes.data ?? []);
        }
      } catch (err) {
        handleApiError(err, "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

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
          <Link href="/dashboard/tenant/payment/history">
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

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Recent Payments
          </CardTitle>
          <Link
            href="/dashboard/tenant/payment/history"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>

        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No payments yet.
            </p>
          ) : (
            <div className="divide-y">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {payment.rentalRequest.property?.title ?? "Property"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      ${Number(payment.amount).toFixed(2)}
                    </span>
                    <Badge variant={statusVariant[payment.status]}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
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