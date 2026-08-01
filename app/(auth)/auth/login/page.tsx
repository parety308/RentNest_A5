
import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "../_component/LoginForm";


const LoginPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Logo className="my-5" />
            <Card className="p-4">
                <h1 className="text-xl text-center font-semibold">Welcome Back</h1>
                <p className="text-center">Sign in to pick up where you left off.</p>
                <LoginForm />
                <p className="text-center">New to RentNest? <Link className="text-blue-500 underline" href={'/auth/register'}>Create an account</Link></p>
            </Card>
        </div>
    );
};

export default LoginPage;