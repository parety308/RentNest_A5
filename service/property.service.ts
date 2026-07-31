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



export async function getProperties(
    query?: PropertyQuery
): Promise<PropertyResponse> {


    const params = new URLSearchParams();


    Object.entries(query || {}).forEach(([key, value]) => {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            params.append(key, String(value));
        }

    });



    const url = params.toString()
        ? `/properties?${params.toString()}`
        : "/properties";



    const response = await apiClient(url);



    // remove API wrapper
    return response.data;

}