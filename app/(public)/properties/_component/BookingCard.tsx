"use client"
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { getMe } from "@/service/getMe";
import { useRouter } from "next/navigation";

import RentalRequestSheet from "./RentalRequestSheet";

interface Props {
    property: Property;
    mobile?: boolean;
}

function formatPrice(price: number) {
    return price.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    });
}

export default function BookingCard({ property, mobile = false }: Props) {
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [requested, setRequested] = useState(false);

    const handleRentClick = async () => {
        const user = await getMe();

        if (!user?.success) {
            router.push("/auth/login");
            return;
        }

        setSheetOpen(true);
    };

    const buttonLabel = requested ? "Request Sent" : "Rent Now";
    const isDisabled = !property.available || requested;

    const sheet = (
        <RentalRequestSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            propertyId={property.id}
            propertyTitle={property.title}
            availableFrom={property.availableFrom}
            onSuccess={() => setRequested(true)}
        />
    );

    if (mobile) {
        return (
            <>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xl font-bold">
                            ${formatPrice(property.price)}
                            <span className="text-muted-foreground text-sm font-normal">
                                /month
                            </span>
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {property.available ? "Available Now" : "Currently Unavailable"}
                        </p>
                    </div>

                    <Button onClick={handleRentClick} className="h-11 px-8" disabled={isDisabled}>
                        {buttonLabel}
                    </Button>
                </div>

                {sheet}
            </>
        );
    }

    return (
        <>
            <Card className="p-6 space-y-5">
                <div>
                    <h2 className="text-3xl font-bold">
                        ${formatPrice(property.price)}
                        <span className="text-muted-foreground text-base font-normal">
                            /month
                        </span>
                    </h2>

                    <p className="text-sm text-muted-foreground mt-2">
                        {property.available ? "Available Now" : "Currently Unavailable"}
                    </p>
                </div>

                <Button onClick={handleRentClick} className="w-full h-11" disabled={isDisabled}>
                    {buttonLabel}
                </Button>
            </Card>

            {sheet}
        </>
    );
}