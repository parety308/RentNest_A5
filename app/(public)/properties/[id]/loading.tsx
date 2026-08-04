import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
                <section className="space-y-10">
                    <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-lg" />
                        ))}
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-9 w-2/3" />
                        <Skeleton className="h-5 w-1/3" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </section>

                <aside className="hidden lg:block">
                    <div className="sticky top-24 rounded-xl border p-6 space-y-5">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                </aside>
            </div>
        </main>
    );
}