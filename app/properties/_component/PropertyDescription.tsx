import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";

interface Props {
  property: Property;
}

export default function PropertyDescription({ property }: Props) {
  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold">About this home</h2>

        <p className="mt-5 leading-8 text-muted-foreground">
          {property.description}
        </p>
      </CardContent>
    </Card>
  );
}