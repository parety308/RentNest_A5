"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginAction } from "../_actions/LoginActions";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter()
    const [state, action, pending] = useActionState(LoginAction, false);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || 'User Logged in Successfully')
        }
        if (!state.success && !state.errors) {
            toast.error(state.message || 'login Failed')
        }
    }, [state, router])

    return (
        <div>
            <form action={action}>
                <Card className="p-6 w-100">
                    <Label htmlFor="email">Email</Label>
                    <Input id='email' placeholder="you@exapmle.com" name="email" type="email" />
                    {state?.errors?.email && (
                        <p className="text-sm text-destructive">{state.errors.email[0]}</p>
                    )}

                    <Label htmlFor="password">Password</Label>
                    <Input id='password' placeholder="........" name="password" type="password" />
                    {state?.errors?.password && (
                        <p className="text-sm text-destructive">{state.errors.password[0]}</p>
                    )}

                    <Button type="submit">
                        {pending ? "Submitting ..." : "Sign in"}
                    </Button>
                </Card>
            </form>
        </div>
    );
};

export default LoginForm;