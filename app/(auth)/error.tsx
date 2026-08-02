"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <Logo className="my-5" />

            <Card className="w-full max-w-sm p-6">
                <CardContent className="flex flex-col items-center gap-5 p-0 text-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold">
                            Authentication error
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            We couldn&apos;t process your request. Please try
                            again.
                        </p>
                    </div>

                    <Button onClick={() => reset()} className="w-full">
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}