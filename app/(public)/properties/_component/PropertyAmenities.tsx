import {
  Wifi,
  Car,
  Shield,
  Dumbbell,
  Trees,
  Waves,
  PawPrint,
  Snowflake,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";

const icons: Record<string, any> = {
  Wifi,
  Parking: Car,
  Security: Shield,
  Gym: Dumbbell,
  Garden: Trees,
  Pool: Waves,
  Pets: PawPrint,
  AC: Snowflake,
};

interface Props {
  property: Property;
}

export default function PropertyAmenities({ property }: Props) {
  const amenities = property.amenities ?? [];

  if (amenities.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Amenities</h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item) => {
            const Icon = icons[item] || CheckCircle2;

            return (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:bg-muted hover:shadow-sm"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <span className="font-medium">{item}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}