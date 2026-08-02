import { apiClient } from "./client";

// Mirrors backend src/modules/property/property.interface.ts (ICreateProperty)
export interface ICreatePropertyPayload {
    title: string;
    description: string;

    address: string;
    city: string;
    state: string;
    neighborhood: string;
    location?: string;

    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;

    images: string[];
    amenities: string[];

    available: boolean;
    availableFrom?: string | null;

    rating?: number;
    reviewCount?: number;
    featured?: boolean;

    categoryId: string;
}

// Mirrors backend src/modules/landlord/landlord.interface.ts (IUpdateProperty)
export interface IUpdatePropertyPayload {
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    availableFrom?: string | null;
    amenities: string[];
    images: string[];
    status?: "AVAILABLE" | "UNAVAILABLE";
    categoryId: string;
}

export interface IUpdateRentalRequestPayload {
    status: "APPROVED" | "REJECTED"| "ACTIVE" | "COMPLETED";
}

export interface ICategory {
    id: string;
    name: string;
}

// Shape returned by GET /landlord/properties and GET /landlord/properties/:id
// (property row + included category)
export interface IProperty {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    neighborhood: string | null;
    location: string | null;
    price: string | number;
    bedrooms: number | null;
    bathrooms: number | null;
    sqft: number | null;
    images: string[];
    amenities: string[];
    available: boolean;
    availableFrom: string | null;
    status: "AVAILABLE" | "UNAVAILABLE";
    categoryId: string;
    category?: ICategory;
}

export const landlordService = {
    // POST /landlord/properties
    createProperty: async (data: ICreatePropertyPayload) => {
        return apiClient("/landlord/properties", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // GET /landlord/properties
    getMyProperties: async () => {
        return apiClient("/landlord/properties");
    },

    // GET /landlord/properties/:id
    getProperty: async (id: string) => {
        return apiClient(`/landlord/properties/${id}`);
    },

    // PUT /landlord/properties/:id
    updateProperty: async (id: string, data: IUpdatePropertyPayload) => {
        return apiClient(`/landlord/properties/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    // DELETE /landlord/properties/:id
    deleteProperty: async (id: string) => {
        return apiClient(`/landlord/properties/${id}`, {
            method: "DELETE",
        });
    },

    // GET /landlord/requests
    getAllRentalRequests: async () => {
        return apiClient("/landlord/requests");
    },

    // PATCH /landlord/requests/:id
    updateRentalRequest: async (
        id: string,
        data: IUpdateRentalRequestPayload
    ) => {
        return apiClient(`/landlord/requests/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    // GET /categories (needed to populate the category select on the property form)
    getCategories: async (): Promise<{ data: ICategory[] }> => {
        return apiClient("/categories");
    },
};