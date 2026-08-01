"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: document.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // navigator.share rejects when the user just cancels the sheet —
      // nothing to surface to the user, but don't let it crash.
      console.error(error);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      aria-label="Share property"
    >
      {copied ? (
        <Check className="h-5 w-5" />
      ) : (
        <Share2 className="h-5 w-5" />
      )}
    </Button>
  );
}