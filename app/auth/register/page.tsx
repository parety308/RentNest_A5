
import { Logo } from "@/app/shared/Logo";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import RegisterForm from "../_component/RegisterForm";


const RegisterPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen ">
            <Logo className="my-5" />
            <RegisterForm/>
        </div>
    );
};

export default RegisterPage;