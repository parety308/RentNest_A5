

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProperties } from "@/service/property.service";
import PropertyCard from "@/app/properties/_component/PropertyCard";
import { Property } from "@/types/property";



export default async function FeaturedProperties() {
    const { data: properties } = await getProperties({
        limit: "all",
    });

    const featured = properties.filter((property: Property) => property.featured).slice(0, 6);
    return (
        <section className="py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Featured homes this week
                        </h2>

                        <p className="mt-2 max-w-xl text-muted-foreground">
                            Hand-picked listings from verified landlords with exceptional
                            response rates and transparent pricing.
                        </p>
                    </div>

                    <Button variant="outline" >
                        <Link className="p-2 flex gap-2 justify-center items-center" href="/properties">
                            Browse all listings
                            <ArrowRight className="h-6 w-8" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {featured.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}