"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";

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
    const handleRent = () => {
        console.log("click")
    }
    if (mobile) {
        return (
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

                <Button onClick={handleRent}  className="h-11 px-8" disabled={!property.available}>
                    Rent Now
                </Button>
            </div>
        );
    }

    return (
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

            <Button onClick={handleRent} className="w-full h-11" disabled={!property.available}>
                Rent Now
            </Button>
        </Card>
    );
}