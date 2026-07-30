"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({
  className,
  showText = true,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
        <svg
          width="17"
          height="17"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 9.2 10 3.5l7 5.7V16a1 1 0 0 1-1 1h-3.6v-4.3H7.6V17H4a1 1 0 0 1-1-1V9.2Z"
            fill="currentColor"
          />
        </svg>
      </span>

      {showText && (
        <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">
          RentNest
        </span>
      )}
    </Link>
  );
}