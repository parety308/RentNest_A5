import {
  BedDouble,
  Bath,
  Ruler,
  Building2,
  CalendarDays,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";

interface Props {
  property: Property;
}

function formatAvailableFrom(availableFrom?: string | null) {
  if (!availableFrom) return "Contact for availability";

  const date = new Date(availableFrom);
  if (Number.isNaN(date.getTime())) return "Contact for availability";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PropertyOverview({ property }: Props) {
  const specs = [
    {
      icon: BedDouble,
      label:
        property.bedrooms != null ? `${property.bedrooms} Bedrooms` : "Studio",
    },
    {
      icon: Bath,
      label:
        property.bathrooms != null ? `${property.bathrooms} Bathrooms` : "N/A",
    },
    {
      icon: Ruler,
      label: property.sqft != null ? `${property.sqft} sqft` : "N/A",
    },
    {
      icon: Building2,
      // was property.propertyType, which doesn't exist on this model —
      // property type now comes from the category relation
      label: property.category.name,
    },
    {
      icon: CalendarDays,
      label: formatAvailableFrom(property.availableFrom),
    },
  ];

  return (
    <Card className="mt-8 p-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {specs.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg border p-5 transition hover:bg-muted/50"
            >
              <Icon className="mb-3 h-6 w-6 text-primary" />

              <span className="text-center text-sm font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}