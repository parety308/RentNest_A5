"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PublicError({
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
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
            <Card className="w-full max-w-lg border-0 shadow-lg">
                <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                    <div className="rounded-full bg-destructive/10 p-5">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Couldn&apos;t load this page
                        </h1>
                        <p className="text-muted-foreground">
                            Something went wrong while fetching properties or
                            page content. Please try again.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={() => reset()}>Try again</Button>

                        <Button asChild variant="outline">
                            <Link href="/properties">
                                <Search className="mr-2 h-4 w-4" />
                                Browse Properties
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}