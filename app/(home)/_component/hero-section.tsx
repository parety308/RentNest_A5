"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Search, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (query.trim()) {
            router.push(`/properties?q=${encodeURIComponent(query)}`);
        } else {
            router.push("/properties");
        }
    };

    return (
        <section className="relative overflow-hidden border-b">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.jpg"
                    alt="Luxury apartment"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-white/85  via-white/55  to-white/20  dark:from-black/70  dark:via-black/45 dark:to-black/25 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-10 py-10 lg:py-10">
                <div className="max-w-2xl text-foreground">

                    {/* Badge */}
                    <div className="
inline-flex items-center gap-2
rounded-full
border
border-border
bg-background/70
backdrop-blur
px-4 py-2
shadow-sm
">
                        <span className="h-2 w-2 rounded-full bg-primary" />

                        <span className="text-sm font-medium">
                            Now live in 34 US metros
                        </span>
                    </div>


                    {/* Heading */}
                    <h2 className="mt-8 text-3xl font-bold md:text-5xl">
                        Find a rental you will actually want to live in.
                    </h2>


                    {/* Description */}
                    <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                        Real photos, verified landlords, transparent pricing,
                        and instant booking requests. Discover apartments,
                        houses and condos across the United States.
                    </p>


                    {/* Search */}
                    <form
                        onSubmit={onSearch}
                        className="
mt-10
rounded-2xl
border
bg-background/95
backdrop-blur
shadow-xl
p-3
"
                    >
                        <div className="flex flex-col gap-3 md:flex-row">

                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Try 'Austin', 'Chicago', or 'New York'"
                                    className="
h-14
w-full
rounded-xl
bg-transparent
pl-12
pr-4
text-foreground
placeholder:text-muted-foreground
outline-none
"
                                />
                            </div>


                            <Button
                                size="lg"
                                type="submit"
                                className="h-14 rounded-xl px-8"
                            >
                                Search Homes

                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                        </div>
                    </form>


                    {/* Stats */}
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">

                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                            <span>
                                <strong className="text-white">
                                    4.8
                                </strong>{" "}
                                from 12,480 renters
                            </span>
                        </div>


                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />

                            <span>
                                <strong className="text-foreground">
                                    3,164
                                </strong>{" "}
                                homes available today
                            </span>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}