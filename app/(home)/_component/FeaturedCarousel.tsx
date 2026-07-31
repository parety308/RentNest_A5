"use client";

import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

import PropertyCard from "@/app/properties/_component/PropertyCard";
import { Property } from "@/types/property";


export default function FeaturedCarousel({
    properties,
}: {
    properties: Property[];
}) {

    const autoplay = useMemo(
        () =>
            Autoplay({
                delay: 1500, // 4 seconds between slides
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
                        <PropertyCard property={property} />
                    </CarouselItem>
                ))}

            </CarouselContent>

        </Carousel>
    );
}