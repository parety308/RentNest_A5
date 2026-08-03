import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getProperties } from "@/service/property.service";
import { getSavedPropertyIds } from "@/service/getSavedPropertyIds"; 
import { Property } from "@/types/property";
import FeaturedCarousel from "./FeaturedCarousel";




export default async function FeaturedProperties() {

    const { data: properties } = await getProperties({
        limit: "all",
    });

    const savedIds = await getSavedPropertyIds(); 

    const featured = properties
        .filter((property: Property) => property.featured)
        .slice(0, 6);


    return (
        <section className="py-24">

            <div className="container mx-auto max-w-7xl px-6">

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Featured homes this week
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Hand-picked listings from verified landlords.
                        </p>
                    </div>


                    <Button variant="outline">
                        <Link
                            href="/properties"
                            className="flex items-center gap-2"
                        >
                            Browse all listings
                            <ArrowRight />
                        </Link>
                    </Button>

                </div>


                <div className="mt-12">
                    <FeaturedCarousel properties={featured} savedIds={savedIds} />
                </div>


            </div>

        </section>
    );
}