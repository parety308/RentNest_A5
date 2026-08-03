import { apiClient } from "./client";

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    propertyId: string;
    tenantId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const reviewService = {
  // Backend: POST /reviews (auth: TENANT | ADMIN)
  // Do NOT send tenantId (set server-side from req.user.id) or
  // rentalRequestId (not a field on the Review model — Prisma rejects it).
  createReview: async (
    payload: CreateReviewPayload
  ): Promise<ReviewResponse> => {
    return apiClient("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};