"use client";

import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";


import { Property } from "@/types/property";
import PropertyCard from "../properties/_component/PropertyCard";


export default function FeaturedCarousel({
    properties,
    savedIds = [],
}: {
    properties: Property[];
    savedIds?: string[];
}) {

    const autoplay = useMemo(
        () =>
            Autoplay({
                delay: 1500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        []
    );


    return (
        <Carousel
            plugins={[autoplay]}
            opts={{
                loop: true,
                align: "start",
            }}
        >

            <CarouselContent>

                {properties.map((property) => (
                    <CarouselItem
                        key={property.id}
                        className="
                            basis-full
                            sm:basis-1/2
                            lg:basis-1/3
                        "
                    >
                        <PropertyCard
                            property={property}
                            initialSaved={savedIds.includes(property.id)}
                        />
                    </CarouselItem>
                ))}

            </CarouselContent>

        </Carousel>
    );
}