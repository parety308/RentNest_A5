"use server"

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!refreshToken) {
        // throw new Error("User Not Logged In!");

        return {
            success: false,
            message: "Refresh token not found!"
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
            Cookie: `refreshToken=${refreshToken}`
        },
        cache: "no-cache",
    });

    const result = await res.json();


    return result
}