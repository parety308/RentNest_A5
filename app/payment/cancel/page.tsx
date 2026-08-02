"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              Your payment was cancelled and no money has been charged.
              You can try again whenever you are ready.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/dashboard/tenant/rental-requests">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}