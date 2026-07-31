"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const PropertySort = () => {

    const router = useRouter();

    const searchParams = useSearchParams();


    const updateSort = (value: string | null) => {
        if (!value) return;

        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value === "recommended") {
            params.delete("sort");
        } else {
            params.set("sort", value);
        }

        params.delete("page");

        router.push(`/properties?${params.toString()}`);
    };


    return (

        <Select

            value={
                searchParams.get("sort") ?? "recommended"
            }

            onValueChange={updateSort}

        >

            <SelectTrigger className="w-full rounded-xl">

                <SelectValue />

            </SelectTrigger>


            <SelectContent>

                <SelectItem value="recommended">
                    Recommended
                </SelectItem>


                <SelectItem value="price_low">
                    Price: Low to High
                </SelectItem>


                <SelectItem value="price_high">
                    Price: High to Low
                </SelectItem>


                <SelectItem value="newest">
                    Newest
                </SelectItem>

            </SelectContent>

        </Select>

    );

};


export default PropertySort;