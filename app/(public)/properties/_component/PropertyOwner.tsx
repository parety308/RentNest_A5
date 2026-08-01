import { Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";

interface Props {
  landlord: Property["landlord"];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PropertyOwner({ landlord }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Meet your landlord</h2>

        <div className="flex items-center gap-4">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {getInitials(landlord.name)}
          </div>

          <div>
            <h3 className="font-semibold text-lg">{landlord.name}</h3>
            <p className="text-sm text-muted-foreground">{landlord.email}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" asChild>
            <a href={`mailto:${landlord.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Message
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}