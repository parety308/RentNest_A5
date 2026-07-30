// "use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getProperties } from "../../service/property.service";
import PropertyCard from "./_component/PropertyCard";

const cities = [
    "All cities",
    "Austin",
    "Boulder",
    "Brookline",
    "Chicago",
    "Denver",
    "Nashville",
    "New Orleans",
    "Philadelphia",
    "Phoenix",
    "Portland",
    "Seattle",
];

const PropertiesPage = async () => {
    const properties = await getProperties();
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Hero */}
            <section className="border-b bg-background">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <h1 className="text-3xl font-bold">Browse Rentals</h1>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Discover verified apartments, houses and condos from trusted
                        landlords.
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8  py-10 lg:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-6 min-h-screen rounded-xl border bg-background p-6">
                        <div className="mb-6 flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5" />
                            <h2 className="font-semibold">Filters</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="mt-8 flex flex-col gap-4 ">
                                <div >
                                    <Input
                                        placeholder="Search by city, neighborhood..."
                                        className="h-12 pl-2"
                                    />
                                </div>

                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium">Location</p>

                                <Select>
                                    <SelectTrigger className="w-full rounded-xl">
                                        <SelectValue placeholder="All cities" />
                                    </SelectTrigger>

                                    <SelectContent className="rounded-xl">
                                        {cities.map((city) => (
                                            <SelectItem
                                                key={city}
                                                value={city}
                                                className="cursor-pointer rounded-lg"
                                            >
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium">Property Type</p>

                                <div className="space-y-2">
                                    {["Apartment", "House", "Studio", "Condo"].map((type) => (
                                        <div key={type} className="flex items-center gap-2">
                                            <Checkbox id={type} />
                                            <Label htmlFor={type}>{type}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium">Price</p>
                                <Input placeholder="$500 - $5000" />
                            </div>

                            <Button className="w-full">Apply Filters</Button>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main>
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-lg font-semibold">126 Properties Found</h2>

                        <div className="flex gap-3">
                            <Button variant="outline" className="lg:hidden">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                            </Button>

                            <Select defaultValue="recommended">
                                <SelectTrigger className="w-45">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="recommended">
                                        Recommended
                                    </SelectItem>

                                    <SelectItem value="low">
                                        Price: Low to High
                                    </SelectItem>

                                    <SelectItem value="high">
                                        Price: High to Low
                                    </SelectItem>

                                    <SelectItem value="newest">
                                        Newest
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PropertiesPage;