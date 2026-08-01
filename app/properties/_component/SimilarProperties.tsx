import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

interface Props {
  properties: Property[];
}

export default function SimilarProperties({ properties }: Props) {
  if (properties.length === 0) return null;

  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">Similar Properties</h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}