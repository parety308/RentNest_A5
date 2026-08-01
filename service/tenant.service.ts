import { RentalRequest, CreateRentalRequestPayload } from "@/types/rental.type";
import { apiClient } from "./client";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


export async function getMyRentalRequests(): Promise<RentalRequest[]> {
  const res: ApiResponse<RentalRequest[]> = await apiClient("/rentals");
  return res.data ?? [];
}

// GET /api/rentals/:id -> single rental request
export async function getRentalRequestById(id: string): Promise<RentalRequest | null> {
  const res: ApiResponse<RentalRequest | []> = await apiClient(`/rentals/${id}`);
  return Array.isArray(res.data) ? null : res.data;
}

// POST /api/rentals -> create a rental request (tenant applies for a property)
export async function createRentalRequest(
  payload: CreateRentalRequestPayload
): Promise<RentalRequest> {
  const res: ApiResponse<RentalRequest> = await apiClient("/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

// Derived helpers — the backend doesn't split "rentals" vs "requests",
// so we split status client-side.

// "My Rentals" = confirmed tenancies (approved & paid, active or completed)
export async function getMyActiveRentals(): Promise<RentalRequest[]> {
  const all = await getMyRentalRequests();
  return all.filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED");
}

// "My Requests" = everything still in the pipeline (pending/approved/rejected)
export async function getMyPendingRequests(): Promise<RentalRequest[]> {
  const all = await getMyRentalRequests();
  return all.filter((r) => r.status === "PENDING" || r.status === "APPROVED" || r.status === "REJECTED");
}