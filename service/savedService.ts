import { apiClient } from "./client";

export interface SavedPropertyResponse {
  success: boolean;
  message: string;
  data: any[];
}

export const savedService = {
  saveProperty: async (propertyId: string) => {
    return apiClient(`/properties/${propertyId}/save`, { method: "POST" });
  },

  unsaveProperty: async (propertyId: string) => {
    return apiClient(`/properties/${propertyId}/save`, { method: "DELETE" });
  },

  getSavedProperties: async (): Promise<SavedPropertyResponse> => {
    return apiClient("/properties/saved");
  },
};