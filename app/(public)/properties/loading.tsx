import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-muted/30">
            <section className="border-b bg-background">
                <div className="mx-auto max-w-7xl px-6 py-12 flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8 py-10 lg:grid-cols-[280px_1fr]">
                <aside className="hidden lg:block">
                    <div className="rounded-xl border bg-background p-6 space-y-6">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </aside>

                <main className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border overflow-hidden">
                            <Skeleton className="h-56 w-full rounded-none" />
                            <div className="p-5 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}