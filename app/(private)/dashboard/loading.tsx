
import { Building2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Building2 className="h-6 w-6" />
                    </div>

                    <span className="text-2xl font-bold tracking-tight">
                        RentNest
                    </span>
                </div>

                {/* Loader */}
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
                </div>

                <p className="text-sm text-muted-foreground">
                    Finding your perfect place...
                </p>
            </div>
        </div>
    );
}

