"use client";

import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

import SaveButton from "./SaveButton";

import { Property } from "@/types/property";
import ShareButton from "./Share Button";

interface Props {
  property: Property;
}

export default function PropertyHeader({ property }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {property.city}, {property.state}
              </span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {property.rating}
              </span>

              <span>({property.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <SaveButton propertyId={property.id} />
          <ShareButton/>
        </div>
      </div>
    </motion.div>
  );
}