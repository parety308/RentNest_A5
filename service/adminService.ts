import { apiClient } from "./client";

export interface GetUsersParams {
    page?: number;
    limit?: number;
    role?: string;
}

export interface UpdateUserStatusPayload {
    isBanned: boolean;
}

export interface UpdatePropertyStatusPayload {
    status: "AVAILABLE" | "UNAVAILABLE";
}

export const adminService = {
    getAllUsers: async (params?: GetUsersParams) => {
        const query = new URLSearchParams();

        if (params?.page) {
            query.append("page", String(params.page));
        }

        if (params?.limit) {
            query.append("limit", String(params.limit));
        }

        if (params?.role) {
            query.append("role", params.role);
        }

        const queryString = query.toString();

        return apiClient(
            `/admin/users${queryString ? `?${queryString}` : ""}`
        );
    },

    updateUserStatus: async (
        id: string,
        data: UpdateUserStatusPayload
    ) => {
        return apiClient(`/admin/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    getAllProperties: async () => {
        return apiClient("/admin/properties");
    },

    updatePropertyStatus: async (
        id: string,
        data: UpdatePropertyStatusPayload
    ) => {
        return apiClient(`/admin/properties/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    deleteProperty: async (id: string) => {
        return apiClient(`/admin/properties/${id}`, {
            method: "DELETE",
        });
    },

    getAllRentals: async () => {
        return apiClient("/admin/rentals");
    },
};