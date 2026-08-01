import Image from "next/image";
import { Heart, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Property } from "@/types/property";



interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={
              property.images?.[0] ||
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
            }
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out hover:scale-110 hover:translate-y-1"
          />

          <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 rounded-full shadow-md"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {property.available === false && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
            Not Available
          </span>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold">
            {property.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>

          {property.rating && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {property.rating}
              </span>

              {property.reviewCount && (
                <span className="text-muted-foreground">
                  ({property.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>


        <div className="mt-auto">
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>{property.bedrooms} Beds</span>
            <span>{property.bathrooms} Baths</span>
            <span>{property.sqft} sqft</span>
          </div>


          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div>
              <span className="text-xl font-bold">
                ${property.price.toLocaleString()}
              </span>

              <span className="text-muted-foreground">
                /month
              </span>
            </div>

            <Link href={`/properties/${property.id}`}>
              <Button className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;