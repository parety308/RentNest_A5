"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { paymentService } from "@/service/paymentService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                toast.error("Payment session not found");
                setLoading(false);
                return;
            }

            try {
                const response = await paymentService.verifyPayment({
                    sessionId,
                });

                if (response.success) {
                    setVerified(true);
                    toast.success("Payment completed successfully");
                }
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Payment verification failed"
                );
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Verifying payment...</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center py-10 text-center">
                    {verified ? (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-600" />

                            <h1 className="mt-5 text-2xl font-bold">
                                Payment Successful
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Your payment has been completed successfully. Your rental
                                request is now active.
                            </p>

                            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                                <Button asChild className="flex-1">
                                    <Link href="/dashboard/tenant">
                                        Go to Dashboard
                                    </Link>
                                </Button>

                                <Button asChild variant="outline" className="flex-1">
                                    <Link href="/">
                                        Go to Home
                                    </Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold">
                                Payment Verification Failed
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                We could not verify your payment. Please check your payment
                                history or contact support if the issue persists.
                            </p>

                            <Button asChild className="mt-6 w-full">
                                <Link href="/dashboard/tenant">
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}