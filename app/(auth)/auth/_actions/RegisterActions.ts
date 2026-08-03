'use server'

import { registerSchema } from "@/app/lib/validations/auth"



type RegisterState = {
    success: boolean,
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
    data?: {
        id: string,
        name: string,
        email: string,
        role: string,
        isBanned: boolean,
        createdAt: Date,
        updatedAt: Date
    }
}

export const RegisterAction = async (prevState: RegisterState, formData: FormData) => {
    const raw = {
        fname: formData.get("fname"),
        lname: formData.get("lname"),
        email: formData.get("email"),
        password: formData.get("password"),
        cpassword: formData.get("cpassword"),
        role: formData.get("role"),
    };

    const parsed = registerSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success: false,
            statusCode: 400,
            message: "Please fix the errors below",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const fullName = `${parsed.data.fname} ${parsed.data.lname}`.trim();
    const payload = {
        name: fullName,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await res.json();
    return result;
}