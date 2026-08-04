"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/service/client";
import { Button } from "@/components/ui/button";
import { savedService } from "@/service/savedService";

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
  const router = useRouter();

  async function handleToggle() {
    const next = !saved;

    setSaved(next);
    setLoading(true);

    try {
      const res = next
        ? await savedService.saveProperty(propertyId)
        : await savedService.unsaveProperty(propertyId);

      if (!res?.success) {
        throw new Error(res?.message ?? "Failed to update saved property");
      }

      toast.success(next ? "Added to saved homes" : "Removed from saved homes");
    } catch (error) {
      setSaved(!next); // revert on failure

      if (error instanceof ApiError && error.status === 401) {
        toast.error("Please sign in to save properties");
        router.push("/auth/login");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Couldn't update saved properties. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
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