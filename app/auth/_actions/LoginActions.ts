"use server"

import { cookies } from "next/headers"

type LoginState = {
    success: boolean,
    statusCode: number,
    message: string,
    data?: {
        accessToken: string,
        refreshToken: string
    }
}

export const LoginAction = async (
    prevState: LoginState,
    formData: FormData
) => {

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const result = await res.json();


    if(result.success){

        const cookieStore = await cookies();

        cookieStore.set(
            "accessToken",
            result.data.accessToken,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:60 * 60 * 24,
                path:"/"
            }
        );


        cookieStore.set(
            "refreshToken",
            result.data.refreshToken,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:60 * 60 * 24,
                path:"/"
            }
        );
    }


    return result;
}