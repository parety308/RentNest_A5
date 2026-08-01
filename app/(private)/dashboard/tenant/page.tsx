"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { RentalRequest } from "@/types/rental.type";
import { getMyRentalRequests } from "@/service/tenant.service";

const TenantDashboard = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyRentalRequests();
        setRequests(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    active: requests.filter((r) => r.status === "ACTIVE").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard…</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Active Rentals", value: counts.active },
          { label: "Completed", value: counts.completed },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold text-[#16523D] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link href="/tenant/requests" className="text-sm text-[#16523D] hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activity yet.</p>
        ) : (
          <div className="rounded-xl border divide-y">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{r.property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#16523D]/10 text-[#16523D]">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;