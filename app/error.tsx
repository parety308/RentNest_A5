"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
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
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
            <Card className="w-full max-w-lg border-0 shadow-lg">
                <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                    <div className="rounded-full bg-destructive/10 p-5">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Something went wrong
                        </h1>
                        <p className="text-muted-foreground">
                            An unexpected error occurred while loading this page.
                            You can try again, or head back home.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={() => reset()}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Try again
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}