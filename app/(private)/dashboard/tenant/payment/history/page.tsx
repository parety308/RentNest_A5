"use client";

import { useEffect, useState } from "react";
import { Calendar, CreditCard, Loader2, Receipt } from "lucide-react";

import { paymentService } from "@/service/paymentService";
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

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await paymentService.getPaymentHistory();

        if (res.success) {
          setPayments(res.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
        setError(err instanceof Error ? err.message : "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
          <CardContent className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all your payment transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>

        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No Payments Found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                You have not made any payments yet.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      {payment.rentalRequest.property?.title ??
                        "Property"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {payment.provider}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          payment.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Transaction ID: {payment.transactionId}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold">
                      ${Number(payment.amount).toFixed(2)}
                    </p>

                    <Badge
                      variant={
                        statusVariant[payment.status]
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}