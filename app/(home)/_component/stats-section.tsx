"use client";

const stats = [
  {
    value: "3,164",
    label: "Verified listings",
  },
  {
    value: "12.4K",
    label: "Renters housed",
  },
  {
    value: "4.8",
    label: "Average landlord rating",
  },
  {
    value: "< 6h",
    label: "Median response time",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">
                {stat.value}
              </h3>

              <p className="mt-3 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}