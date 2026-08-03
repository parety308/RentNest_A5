"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    CreditCard,
    MapPin,
    User,
    Wallet,
} from "lucide-react";

import { paymentService } from "@/service/paymentService";
import { getRentalRequestById } from "@/service/tenant.service";
import { RentalRequest } from "@/types/rental.type";
import { shortDate } from "@/lib/format";

const statusVariant: Record<RentalRequest["status"], "default" | "secondary" | "destructive"> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
    ACTIVE: "default",
    COMPLETED: "secondary",
};

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const rentalRequestId = params.requestId as string;

    const [request, setRequest] = useState<RentalRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [payLoading, setPayLoading] = useState(false);

    useEffect(() => {
        const loadRequest = async () => {
            try {
                const data = await getRentalRequestById(rentalRequestId);
                setRequest(data);

                if (data && data.status !== "APPROVED") {
                    toast.error(
                        "This rental request isn't approved for payment yet."
                    );
                }
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load rental request"
                );
            } finally {
                setLoading(false);
            }
        };

        if (rentalRequestId) loadRequest();
    }, [rentalRequestId]);

    const handlePayNow = async () => {
        if (!rentalRequestId) {
            toast.error("Rental request ID is missing");
            return;
        }

        try {
            setPayLoading(true);

            const response = await paymentService.createPayment({
                rentalRequestId,
            });

            if (response.success) {
                window.location.href = response.data.checkoutUrl;
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to start payment"
            );
        } finally {
            setPayLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
                <Skeleton className="h-9 w-72" />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-56" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Separator />
                            <div className="grid gap-5 md:grid-cols-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-10 text-center">
                <p className="text-sm font-medium text-destructive">
                    Rental request not found, or you don&apos;t have access to
                    it.
                </p>

                <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => router.push("/dashboard/tenant/requests")}
                >
                    Back to Requests
                </Button>
            </div>
        );
    }

    const rent = request.property.price;

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">
                Complete Your Payment
            </h1>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Property Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Rental Details</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {request.property.title}
                            </h2>

                            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {request.property.address},{" "}
                                    {request.property.city},{" "}
                                    {request.property.state}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <User className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Tenant
                                    </p>

                                    <p className="font-medium">
                                        {request.tenant?.name ?? "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Rental Period
                                    </p>

                                    <p className="font-medium">
                                        {request.startDate
                                            ? shortDate(request.startDate)
                                            : "Flexible"}
                                        {" - "}
                                        {request.endDate
                                            ? shortDate(request.endDate)
                                            : "Flexible"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="mb-2 text-sm text-muted-foreground">
                                Rental Status
                            </p>

                            <Badge variant={statusVariant[request.status]}>
                                {request.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Due</span>
                            <span>${rent.toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Charged once as your first month&apos;s rent via
                            Stripe Checkout.
                        </p>

                        <Button
                            onClick={handlePayNow}
                            disabled={
                                payLoading || request.status !== "APPROVED"
                            }
                            className="w-full h-11"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />

                            {payLoading
                                ? "Redirecting to Stripe..."
                                : request.status !== "APPROVED"
                                ? "Not Approved Yet"
                                : "Pay Now"}
                        </Button>

                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-green-600" />

                                <span className="font-medium">
                                    Secure Payment
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                Your payment is securely processed through
                                Stripe. Your card information is never stored
                                on our servers.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}