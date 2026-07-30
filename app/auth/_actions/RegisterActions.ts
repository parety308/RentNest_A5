'use server'
// import { cookies } from "next/headers"

type RegisterState = {
    success: boolean,
    statusCode: number,
    message: string,
    data: {
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
    // console.log(formData)  
    const firstname = formData.get('fname');
    const lastname = formData.get('lname');
    const email = formData.get("email");
    const password = formData.get("password") as string;
    const cpassword = formData.get("cpassword") as string;
    const role = formData.get("role") as string;
    if (password !== cpassword) {
        return {
            success: false,
            message: "Passwords do not match",
        };
    }
    const fullName = `${firstname} ${lastname}`.trim();
    const payload = { name: fullName, email, password, role };
    // console.log({ payload });
    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    )
    const result = await res.json();

    // console.log(result);
    return result
}