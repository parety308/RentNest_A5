"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RentalRequest, RequestStatus } from "@/types/rental.type";
import { getMyPendingRequests } from "@/service/tenant.service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const statusStyles: Record<RequestStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-[#16523D]/10 text-[#16523D]",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-gray-100 text-gray-600",
};

const MyRentalRequests = () => {
    const [requests, setRequests] = useState<RentalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        (async () => {
            try {
                const data = await getMyPendingRequests();
                setRequests(data);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load requests");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-56" />
            <div className="rounded-xl border divide-y">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

    if (requests.length === 0) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-lg font-semibold">No rental requests yet</h2>
                <p className="text-muted-foreground mt-1">
                    Browse properties and submit a request to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">My Rental Requests</h1>
            <div className="rounded-xl border divide-y">
                {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-medium">{req.property.title}</p>
                            <p className="text-sm text-muted-foreground">
                                {req.property.address}, {req.property.city}
                            </p>
                            {req.message && (
                                <p className="text-sm text-muted-foreground mt-1 italic">{req.message}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[req.status]}`}
                            >
                                {req.status}
                            </span>

                            {req.status === "APPROVED" && (
                                <Button
                                    onClick={() =>
                                        router.push(`/dashboard/tenant/payment/${req.id}`)
                                    }
                                >
                                    Pay
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRentalRequests;