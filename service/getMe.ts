"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            message: "User not Logged in",
        };
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`;

    const res = await fetch(url, {
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
    });

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        return {
            success: false,
            message: "API did not return JSON",
            response: text,
        };
    }
};