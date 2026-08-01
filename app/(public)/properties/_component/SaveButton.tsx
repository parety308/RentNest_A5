"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  propertyId: string;
  initialSaved?: boolean;
}

export default function SaveButton({
  propertyId,
  initialSaved = false,
}: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const next = !saved;

    // optimistic update
    setSaved(next);
    setLoading(true);

    try {
      // NOTE: implement this route — it doesn't exist yet.
      const res = await fetch(`/api/properties/${propertyId}/save`, {
        method: next ? "POST" : "DELETE",
      });

      if (!res.ok) throw new Error("Failed to update saved property");
    } catch (error) {
      // revert on failure
      setSaved(!next);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved properties" : "Save property"}
      className="transition-all"
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          saved ? "fill-red-500 text-red-500 scale-110" : ""
        }`}
      />
    </Button>
  );
}