import {
  BadgeCheck,
  Clock3,
  Building2,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";

interface Props {
  property: Property;
}

export default function PropertyHighlights({ property }: Props) {
  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Highlights</h2>

        <div className="mt-8 space-y-6">
          <div className="flex gap-4">
            <BadgeCheck className="mt-1 h-6 w-6 text-green-600" />

            <div>
              <h3 className="font-semibold">Verified Listing</h3>
              <p className="text-sm text-muted-foreground">
                Verified by RentNest.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock3 className="mt-1 h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">Availability</h3>
              <p className="text-sm text-muted-foreground">
                {property.available ? "Available Now" : "Currently Unavailable"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Building2 className="mt-1 h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">Property Type</h3>
              <p className="text-sm text-muted-foreground">
                {/* was property.propertyType, which doesn't exist —
                    property type comes from the category relation */}
                {property.category.name}
              </p>
            </div>
          </div>

          {property.featured && (
            <div className="flex gap-4">
              <Sparkles className="mt-1 h-6 w-6 text-yellow-500" />

              <div>
                <h3 className="font-semibold">Featured Listing</h3>
                <p className="text-sm text-muted-foreground">
                  Handpicked and promoted by RentNest.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}