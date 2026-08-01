"use client";

import { useState } from "react";
import Image from "next/image";

import { Property } from "@/types/property";

interface Props {
  property: Property;
}

export default function PropertyGallery({ property }: Props) {
  const [selected, setSelected] = useState(0);
  const images = property.images ?? [];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-muted text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={images[selected]}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
              selected === index ? "border-primary" : "border-transparent"
            }`}
          >
            <Image
              src={image}
              alt={`${property.title} photo ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}