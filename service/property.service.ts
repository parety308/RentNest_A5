import { Property, PropertyQuery } from "@/types/property";
import { apiClient } from "./client";

export interface PropertyResponse {
    data: Property[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
}

const emptyResponse: PropertyResponse = {
    data: [],
    meta: { page: 1, limit: 9, total: 0, totalPage: 1 },
};

export async function getProperties(
    query?: PropertyQuery
): Promise<PropertyResponse> {
    try {
        const params = new URLSearchParams();

        Object.entries(query || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });

        const url = params.toString()
            ? `/properties?${params.toString()}`
            : "/properties";

        const response = await apiClient(url);

        // Guard against a malformed/empty backend response shape too
        if (!response?.data) {
            return emptyResponse;
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        return emptyResponse;
    }
}

export async function getPropertyById(
    id: string
): Promise<Property | null> {
    try {
        const response = await apiClient(`/properties/${id}`);

        return response.data;
    } catch (error) {

        console.error(`Failed to fetch property ${id}:`, error);
        return null;
    }
}