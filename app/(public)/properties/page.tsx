import { SlidersHorizontal } from "lucide-react";


import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";
import { Props } from "@/types/property";
import { getProperties } from "@/service/property.service";
import { getSavedPropertyIds } from "@/service/getSavedPropertyIds"; 
import PropertySort from "./_component/PropertySort";
import PropertyFilters from "./_component/PropertyFilters";
import PropertyCard from "./_component/PropertyCard";


const PropertiesPage = async ({ searchParams }: Props) => {

    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = "all";


    const { data: properties, meta } = await getProperties({
        ...params,
        page,
        limit,
    });


    const { data: allProperties } = await getProperties({ limit: "all" });

    const savedIds = await getSavedPropertyIds(); 

    const cities: string[] = [
        "All cities",
        ...Array.from(
            new Set(
                allProperties.map(
                    (property) => property.city
                )
            )
        ),
    ];


    const categoryNames: string[] = [
        "All categories",
        ...Array.from(
            new Set(
                allProperties.map(
                    (property) => property.category.name
                )
            )
        ),
    ];


    const minPrice =properties.length > 0
            ? Math.min(
                ...properties.map(
                    (property) => property.price
                )
            )
            : 0;


    const maxPrice = properties.length > 0? Math.max(
                ...properties.map(
                    (property) => property.price
                )
            )
            : 0;

    const createPageURL = (pageNumber: number) => {

        const query = new URLSearchParams(
            params as Record<string, string>
        );

        query.set(
            "page",
            String(pageNumber)
        );

        return `/properties?${query.toString()}`;
    };
    const getPaginationPages = () => {

        const pages: (number | string)[] = [];


        if (meta.totalPage <= 5) {

            return Array.from(
                { length: meta.totalPage },
                (_, i) => i + 1
            );

        }
        pages.push(1);

        if (page > 3) {
            pages.push("...");
        }

        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(meta.totalPage - 1, page + 1);
            i++
        ) {
            pages.push(i);
        }


        if (page < meta.totalPage - 2) {
            pages.push("...");
        }


        pages.push(meta.totalPage);


        return pages;

    };
    return (
        <div className="min-h-screen bg-muted/30">


            {/* Hero */}

            <section className="border-b bg-background">

                <div className="mx-auto max-w-7xl px-6 py-12 flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Browse Rentals
                        </h1>
                        <p> {properties.length} homes match your filters</p>
                        <p className=" max-w-2xl text-muted-foreground">
                            Discover verified apartments, houses and condos from trusted landlords.
                        </p>
                    </div>
                    <div>
                        <PropertySort />

                    </div>
                </div>

            </section>

            <div className="mx-auto grid max-w-7xl gap-8 py-10 lg:grid-cols-[280px_1fr]">


                {/* Sidebar */}

                <aside className="hidden lg:block">

                    <div className="sticky top-6 min-h-screen rounded-xl border bg-background p-6">


                        <div className="mb-6 flex items-center gap-2">

                            <SlidersHorizontal className="h-5 w-5" />

                            <h2 className="font-semibold">
                                Filters
                            </h2>

                        </div>

                        <PropertyFilters
                            cities={cities}
                            categories={categoryNames}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                        />


                    </div>

                </aside>

                {/* Content */}

                <main>

                    {/* Property Cards */}

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">


                        {properties.length > 0 ? (

                            properties.map((property) => (

                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    initialSaved={savedIds.includes(property.id)}
                                />

                            ))

                        ) : (

                            <p className="text-muted-foreground">
                                No properties found.
                            </p>

                        )}


                    </div>

                </main>

                {/* Pagination */}
                {meta.totalPage > 1 && (
                    <div className="col-span-full flex justify-center">
                        <Pagination>
                            <PaginationContent>

                                {page > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={createPageURL(page - 1)}
                                        />
                                    </PaginationItem>
                                )}

                                {getPaginationPages().map((pageNumber, index) => (
                                    <PaginationItem key={index}>
                                        {pageNumber === "..." ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href={createPageURL(Number(pageNumber))}
                                                isActive={pageNumber === page}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                {page < meta.totalPage && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={createPageURL(page + 1)}
                                        />
                                    </PaginationItem>
                                )}

                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

        </div>
    );
};


export default PropertiesPage;