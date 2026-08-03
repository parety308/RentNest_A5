"use server";

import { cookies } from "next/headers";

export const getSavedPropertyIds = async (): Promise<string[]> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/saved`, {
        headers: { Cookie: `accessToken=${accessToken}` },
        cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return (json?.data ?? []).map((p: { id: string }) => p.id);
};