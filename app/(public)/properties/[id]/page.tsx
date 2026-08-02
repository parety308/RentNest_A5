import { Metadata } from "next";
import { notFound } from "next/navigation";

import BookingCard from "../_component/BookingCard";
import PropertyAmenities from "../_component/PropertyAmenities";
import PropertyDescription from "../_component/PropertyDescription";
import PropertyGallery from "../_component/PropertyGallery";
import PropertyHeader from "../_component/PropertyHeader";
import PropertyHighlights from "../_component/PropertyHighlights";
import PropertyMap from "../_component/PropertyMap";
import PropertyOverview from "../_component/PropertyOverview";
import PropertyOwner from "../_component/PropertyOwner";
import PropertyReviews from "../_component/PropertyReviews";
import SimilarProperties from "../_component/SimilarProperties";

import {
  getPropertyById,
  getProperties,
} from "@/service/property.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Property Not Found | RentNest",
    };
  }
  const { data: similarProperties } = await getProperties({
    category: property.category.name,
    limit: 3,
  });

  return {
    title: `${property.title} | RentNest`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images?.length ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Fetch similar properties
  const { data: similarProperties } = await getProperties({
    category: property.category.name,
    limit: "3",
  });

  // Remove current property from the list
  const filteredSimilarProperties = similarProperties.filter(
    (p) => p.id !== property.id
  );

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 pb-28 lg:py-12 lg:pb-12">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-10">
          <PropertyGallery property={property} />

          <PropertyHeader property={property} />

          <PropertyOverview property={property} />

          <PropertyDescription property={property} />

          <PropertyAmenities property={property} />

          <PropertyHighlights property={property} />

          <PropertyMap address={property.address} />

          <PropertyOwner landlord={property.landlord} />

          <PropertyReviews reviews={property.reviews ?? []} />

          <SimilarProperties
            properties={filteredSimilarProperties}
          />
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BookingCard property={property} />
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-lg lg:hidden">
        <BookingCard property={property} mobile />
      </div>
    </main>
  );
}