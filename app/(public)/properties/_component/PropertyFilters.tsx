"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";


interface PropertyFiltersProps {
    cities: string[];
    categories: string[];
    minPrice: number;
    maxPrice: number;
}

const PropertyFilters = ({
    cities,
    categories,
    minPrice,
    maxPrice,
}: PropertyFiltersProps) => {

    const router = useRouter();
    const searchParams = useSearchParams();


    const [citySearch, setCitySearch] = useState(
        searchParams.get("city") ?? ""
    );


    const [min, setMin] = useState(
        searchParams.get("minPrice") ?? ""
    );


    const [max, setMax] = useState(
        searchParams.get("maxPrice") ?? ""
    );



    // Update city/category immediately
    const updateQuery = (
        key: string,
        value: string | null
    ) => {

        const params = new URLSearchParams(
            searchParams.toString()
        );


        if (!value || value.startsWith("All")) {
            params.delete(key);
        } else {
            params.set(key, value);
        }


        router.push(
            `/properties?${params.toString()}`
        );
    };



    // Price filter only when button clicked
    const applyPrice = () => {

        const params = new URLSearchParams(
            searchParams.toString()
        );


        if (min) {
            params.set(
                "minPrice",
                min
            );
        } else {
            params.delete("minPrice");
        }



        if (max) {
            params.set(
                "maxPrice",
                max
            );
        } else {
            params.delete("maxPrice");
        }



        router.push(
            `/properties?${params.toString()}`
        );
    };

 


    return (
        <div className="space-y-6">


            {/* City Search */}
            <div>

                <Input
                    placeholder="Search by city..."
                    value={citySearch}
                    onChange={(e) => {

                        const value = e.target.value;

                        setCitySearch(value);

                        updateQuery(
                            "city",
                            value
                        );

                    }}
                    className="h-12"
                />

            </div>




            {/* City Select */}
            <div>

                <p className="mb-2 text-sm font-medium">
                    Location
                </p>


                <Select

                    value={
                        searchParams.get("city") ?? "All cities"
                    }

                    onValueChange={(value) =>
                        updateQuery(
                            "city",
                            value
                        )
                    }

                >

                    <SelectTrigger className="w-full rounded-xl">

                        <SelectValue placeholder="All cities" />

                    </SelectTrigger>



                    <SelectContent>

                        {cities.map((city) => (

                            <SelectItem
                                key={city}
                                value={city}
                            >
                                {city}
                            </SelectItem>

                        ))}

                    </SelectContent>


                </Select>

            </div>





            {/* Category */}
            <div>

                <p className="mb-2 text-sm font-medium">
                    Property Type
                </p>



                <div className="space-y-2">

                    {categories.map((category) => (

                        <div
                            key={category}
                            className="flex items-center gap-2"
                        >

                            <Checkbox

                                id={category}

                                checked={
                                    searchParams.get("category") === category
                                }


                                onCheckedChange={(checked) => {

                                    updateQuery(
                                        "category",
                                        checked
                                            ? category
                                            : ""
                                    );

                                }}

                            />


                            <Label
                                htmlFor={category}
                                className="cursor-pointer"
                            >
                                {category}
                            </Label>


                        </div>

                    ))}

                </div>


            </div>






            {/* Price Range */}
            <div>

                <p className="mb-2 text-sm font-medium">
                    Price Range
                </p>



                <div className="flex gap-2">


                    <Input

                        type="number"

                        placeholder={`Min ${minPrice}`}

                        value={min}

                        onChange={(e) =>
                            setMin(e.target.value)
                        }

                    />



                    <Input

                        type="number"

                        placeholder={`Max ${maxPrice}`}

                        value={max}

                        onChange={(e) =>
                            setMax(e.target.value)
                        }

                    />


                </div>


            </div>





            <Button

                className="w-full"

                onClick={applyPrice}

            >
                Apply Filters
            </Button>


        </div>
    );
};


export default PropertyFilters;