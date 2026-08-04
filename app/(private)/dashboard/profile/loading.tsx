import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="container mx-auto max-w-4xl py-10">
            <Card className="overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="flex-1 space-y-3 text-center sm:text-left">
                            <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
                            <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
                        </div>
                    </div>
                </div>
                <CardContent className="p-8">
                    <div className="grid gap-5 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}