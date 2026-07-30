import LoginForm from "@/app/auth/_component/LoginForm";
import { Logo } from "@/app/shared/Logo";
import { Card } from "@/components/ui/card";
import Link from "next/link";


const LoginPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Logo className="my-5" />
            <Card className="p-4">
                <h1 className="text-2xl text-center font-semibold">Welcome Back</h1>
                <h1 className="text-center">Sign in to pick up where you left off.</h1>
                <LoginForm />
                <p className="text-center">New to RentNest? <Link className="text-blue-500 underline" href={'/auth/register'}>Create an account</Link></p>
            </Card>
        </div>
    );
};

export default LoginPage;