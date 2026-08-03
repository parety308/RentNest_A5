"use server"

import { cookies } from "next/headers"

export const getMe = async () => {

    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("accessToken")?.value;


    if (!accessToken) {
        return {
            success: false,
            message: "Not logged in"
        }
    }


    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
            headers: {
                Cookie: `accessToken=${accessToken}`
            },
            cache: "no-store"
        }
    );


    return await res.json();
}