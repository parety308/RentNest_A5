"use client";

import { BadgeCheck, Bolt, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Every landlord verified",
    description:
      "Identity, ownership, and payment verification before a listing goes live. No fake listings or hidden surprises.",
  },
  {
    icon: Bolt,
    title: "Requests answered fast",
    description:
      "Homes with quick landlord response times are ranked higher, so you spend less time waiting and more time moving.",
  },
  {
    icon: ShieldCheck,
    title: "Rent held securely",
    description:
      "Deposits and first-month rent are protected until your lease is signed and your keys are delivered.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight">
            Renting is stressful enough.
            <br />
            The platform should not be.
          </h2>

          <p className="mt-5 text-lg text-muted-foreground">
            Every step of renting is designed to feel transparent, secure, and
            incredibly simple.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}