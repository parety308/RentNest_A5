"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
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
        <div className="flex min-h-[50vh] items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">
                            This section failed to load
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {error.message ||
                                "An unexpected error occurred in your dashboard."}
                        </p>
                    </div>

                    <Button onClick={() => reset()}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}