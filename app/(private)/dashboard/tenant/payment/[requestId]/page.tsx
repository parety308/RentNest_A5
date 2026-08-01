"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    CreditCard,
    MapPin,
    User,
    Wallet,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { paymentService } from "@/service/paymentService";


export default function PaymentPage() {
    const params = useParams();
    const rentalRequestId = params.requestId as string;

    const [loading, setLoading] = useState(false);

    const handlePayNow = async () => {
        if (!rentalRequestId) {
            toast.error("Rental request ID is missing");
            return;
        }

        try {
            setLoading(true);

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
            setLoading(false);
        }
    };

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
                                Modern Family Apartment
                            </h2>

                            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    Dhanmondi, Dhaka, Bangladesh
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
                                        MD Parvez Hasan
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
                                        Aug 10, 2026 - Sep 10, 2026
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="mb-2 text-sm text-muted-foreground">
                                Rental Status
                            </p>

                            <Badge>APPROVED</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Monthly Rent
                            </span>

                            <span className="font-medium">
                                $500
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Service Fee
                            </span>

                            <span className="font-medium">
                                $10
                            </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>

                            <span>$510</span>
                        </div>

                        <Button
                            onClick={handlePayNow}
                            disabled={loading}
                            className="w-full h-11"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />

                            {loading ? "Redirecting to Stripe..." : "Pay Now"}
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