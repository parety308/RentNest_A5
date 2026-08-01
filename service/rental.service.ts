"use server";

import { cookies } from "next/headers";

interface CreateRentalRequestPayload {
    propertyId: string;
    message: string;
}

export async function CreateRentalRequest(
    payload: CreateRentalRequestPayload
) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        throw new Error("UNAUTHORIZED");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rentals`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Failed to create rental request");
    }

    return data;
}