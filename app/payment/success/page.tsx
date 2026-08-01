"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { paymentService } from "@/service/paymentService";
import { Card, CardContent } from "@/components/ui/card";


export default function PaymentSuccessPage() {

    const searchParams = useSearchParams();

    const sessionId =
        searchParams.get("session_id");


    const [loading, setLoading] =
        useState(true);


    const [verified, setVerified] =
        useState(false);



    useEffect(() => {

        const verifyPayment = async () => {

            if (!sessionId) {
                toast.error(
                    "Payment session not found"
                );
                setLoading(false);
                return;
            }


            try {

                const response =
                    await paymentService.verifyPayment({
                        sessionId,
                    });


                if(response.success){

                    setVerified(true);

                    toast.success(
                        "Payment completed successfully"
                    );

                }


            } catch(error){

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



    if(loading){

        return (
            <div className="flex min-h-screen items-center justify-center">

                <Loader2 className="h-8 w-8 animate-spin" />

                <span className="ml-3">
                    Verifying payment...
                </span>

            </div>
        );

    }



    return (

        <div className="flex min-h-screen items-center justify-center px-4">

            <Card className="max-w-md w-full">

                <CardContent className="flex flex-col items-center py-10 text-center">


                    {verified ? (

                        <>
                            <CheckCircle2
                                className="h-16 w-16 text-green-600"
                            />

                            <h1 className="mt-5 text-2xl font-bold">
                                Payment Successful
                            </h1>


                            <p className="mt-2 text-muted-foreground">
                                Your rental request is now active.
                            </p>
                        </>

                    ) : (

                        <p>
                            Payment verification failed.
                        </p>

                    )}


                </CardContent>

            </Card>

        </div>

    );
}