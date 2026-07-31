"use server"

import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    // console.log(accessToken)
    if (!accessToken) {
        return {
            success: false,
            message: "User not Logged in"
        };
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;

    // console.log("API URL:", url);

    const res = await fetch(url, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },
        cache: 'force-cache',
        next: {
            revalidate: 60 * 60 * 24,
            tags: ['my-profile']
        }
    });

    // console.log("STATUS:", res.status);
    // console.log("CONTENT TYPE:", res.headers.get("content-type"));

    const text = await res.text();

    // console.log("RESPONSE:", text);

    try {
        return JSON.parse(text);
    } catch {
        return {
            success: false,
            message: "API did not return JSON",
            response: text
        };
    }
};