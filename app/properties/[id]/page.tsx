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

import { getPropertyById } from "@/service/property.service";

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

  return (
    // pb-28 on mobile so the fixed booking bar never covers the last section
    <main className="container mx-auto max-w-7xl px-4 py-8 pb-28 lg:py-12 lg:pb-12">
      {/* Breadcrumb */}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left */}
        <section className="space-y-10">
          <PropertyGallery property={property} />

          <PropertyHeader property={property} />

          <PropertyOverview property={property} />

          <PropertyDescription property={property} />

          <PropertyAmenities property={property} />

          <PropertyHighlights property={property} />

          {/* location was optional in the schema and could be undefined —
              address is required, so it's the reliable value for the map */}
          <PropertyMap address={property.address} />

          <PropertyOwner landlord={property.landlord} />

          {/* Add later once reviews/similar-properties are fetched */}
          {/* <PropertyReviews reviews={reviews} /> */}
          {/* <SimilarProperties properties={similarProperties} /> */}
        </section>

        {/* Right */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BookingCard property={property} />
          </div>
        </aside>
      </div>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-lg lg:hidden">
        <BookingCard property={property} mobile />
      </div>
    </main>
  );
}