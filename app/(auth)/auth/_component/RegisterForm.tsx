"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RegisterAction } from '../_actions/RegisterActions';
import { Check, Home, KeyRound } from 'lucide-react';
import Link from 'next/link';

const RegisterForm = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"TENANT" | "LANDLORD">("TENANT");
    const [state, action, pending] = useActionState(RegisterAction, false);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || 'Account created successfully');
            router.push('/auth/login');
        }

        if (!state.success && !state.errors) {
            toast.error(state.message || 'Registration Failed');
        }
    }, [state, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 max-w-140 mb-2 ">
            <form action={action} className="w-full">
                <Card className="rounded-xl shadow-xl border-0 p-5 space-y-2">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-muted-foreground">
                            Join RentNest and start renting or listing properties.
                        </p>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">I am joining as</h3>

                        <input type="hidden" name="role" value={role} />

                        <div className="grid md:grid-cols-2 gap-5">

                            {/* Tenant */}
                            <button
                                type="button"
                                onClick={() => setRole("TENANT")}
                                className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${role === "TENANT"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                {role === "TENANT" && (
                                    <Check className="absolute right-4 top-4 h-6 w-6 rounded-full bg-green-600 p-1 text-white" />
                                )}

                                <div className="mb-5 h-14 w-14 rounded-xl bg-green-700 flex items-center justify-center">
                                    <KeyRound className="h-7 w-7 text-white" />
                                </div>

                                <h4 className="font-semibold text-lg">I am Renting</h4>

                                <p className="mt-2 text-sm text-muted-foreground leading-6">
                                    Search homes, send rental requests, pay rent online, and manage
                                    your lease.
                                </p>
                            </button>

                            {/* Landlord */}
                            <button
                                type="button"
                                onClick={() => setRole("LANDLORD")}
                                className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${role === "LANDLORD"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                {role === "LANDLORD" && (
                                    <Check className="absolute right-4 top-4 h-6 w-6 rounded-full bg-green-600 p-1 text-white" />
                                )}

                                <div className="mb-5 h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <Home className="h-7 w-7 text-slate-600" />
                                </div>

                                <h4 className="font-semibold text-lg">I am Listing</h4>

                                <p className="mt-2 text-sm text-muted-foreground leading-6">
                                    Publish properties, review applications, approve tenants, and
                                    receive rent payments.
                                </p>
                            </button>
                        </div>

                        {state?.errors?.role && (
                            <p className="text-sm text-red-600">{state.errors.role[0]}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="fname">First Name</Label>
                            <Input
                                id="fname"
                                name="fname"
                                placeholder="John"
                                className="h-11"
                            />
                            {state?.errors?.fname && (
                                <p className="text-sm text-red-600">{state.errors.fname[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lname">Last Name</Label>
                            <Input
                                id="lname"
                                name="lname"
                                placeholder="Doe"
                                className="h-11"
                            />
                            {state?.errors?.lname && (
                                <p className="text-sm text-red-600">{state.errors.lname[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="h-11"
                        />
                        {state?.errors?.email && (
                            <p className="text-sm text-red-600">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                className="h-11"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {state?.errors?.password && (
                                <p className="text-sm text-red-600">{state.errors.password[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input
                                id="cpassword"
                                name="cpassword"
                                type="password"
                                value={confirmPassword}
                                className="h-11"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {state?.errors?.cpassword && (
                                <p className="text-sm text-red-600">{state.errors.cpassword[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Instant client-side hint before submit (server zod .refine is the source of truth) */}
                    {confirmPassword && password !== confirmPassword && !state?.errors?.cpassword && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            Passwords do not match.
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-full h-11 rounded-xl text-base"
                    >
                        {pending ? "Creating Account..." : "Create Account"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?
                        <Link href={'/auth/login'} className="ml-1 font-medium text-green-700 hover:underline cursor-pointer">
                            Sign in
                        </Link>
                    </p>

                </Card>
            </form>
        </div>
    );
};

export default RegisterForm;