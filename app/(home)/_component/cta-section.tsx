"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { compact } from "@/lib/format";


export default function CTASection() {
  return (
    <section className="">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-xl bg-primary px-5 py-5 text-primary-foreground  md:px-10 md:py-5">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Join thousands of happy renters
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              {compact(3164)} homes.
              <br />
              One place to manage it all.
            </h2>

            <p className="mt-5 text-lg leading-8 text-primary-foreground/85">
              Whether you are searching for your first apartment or managing
              multiple rental properties, RentNest keeps listings, requests,
              leases, and rent payments together in one beautiful dashboard.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl"
              >
                <Link href="/auth/register">
                  Create an account
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white hover:text-primary"
              >
                <Link href="/properties">
                  Browse listings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}