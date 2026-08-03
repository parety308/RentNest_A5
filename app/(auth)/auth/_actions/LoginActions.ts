"use server"

import { cookies } from "next/headers"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redirect } from "next/navigation"
import { loginSchema } from "@/app/lib/validations/auth"


type LoginState = {
    success: boolean,
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
    data?: {
        accessToken: string,
        refreshToken: string
    }
}

export const LoginAction = async (
    prevState: LoginState,
    formData: FormData
) => {

    const raw = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsed = loginSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success: false,
            statusCode: 400,
            message: "Please fix the errors below",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsed.data)
        }
    );

    const result = await res.json();

    if (result.success) {
        const cookieStore = await cookies();

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true, secure: false, sameSite: "lax",
            maxAge: 60 * 60 * 24, path: "/"
        });

        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true, secure: false, sameSite: "lax",
            maxAge: 60 * 60 * 24, path: "/"
        });

        const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
        if (decodedToken?.role as string) {
            redirect(`/dashboard/${decodedToken.role.toLowerCase()}`)
        }
    }

    return result;
}