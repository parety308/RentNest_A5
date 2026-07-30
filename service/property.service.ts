import { Property } from "@/types/property";
import { apiClient } from "./client";

export async function getProperties(): Promise<Property[]> {
  const response = await apiClient("/properties");
  // console.log(response.data)
  return response.data;
}