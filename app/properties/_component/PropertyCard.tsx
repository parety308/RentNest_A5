import Image from "next/image";
import { Heart, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
}

interface PropertyCardProps {
    property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
    return (
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">            <div className="relative">
            <div className="relative h-56 w-full">
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                />
            </div>

            <Button
                size="icon"
                variant="secondary"
                className="absolute right-3 top-3 rounded-full"
            >
                <Heart className="h-4 w-4" />
            </Button>
        </div>

            <CardContent className="flex flex-1 flex-col p-5">                <div>
                <h3 className="text-lg font-semibold">
                    {property.title}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                </div>
            </div>

                <div className="mt-auto">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{property.bedrooms} Beds</span>
                        <span>{property.bathrooms} Baths</span>
                        <span>{property.sqft} sqft</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div>
                            <span className="text-xl font-bold">${property.price}</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>

                        <Button>View</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PropertyCard;