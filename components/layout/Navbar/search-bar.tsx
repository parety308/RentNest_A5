"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("city") ?? ""
    );


    const handleSearch = (e?: React.MouseEvent) => {

        e?.stopPropagation();

        const params = new URLSearchParams(
            searchParams.toString()
        );


        if (search.trim()) {
            params.set("city", search);
        } else {
            params.delete("city");
        }


        router.push(`/properties?${params.toString()}`);
    };


    return (
        <div 
            className="relative w-full flex items-center"
            onClick={(e)=>e.stopPropagation()}
        >

            <Input
                type="text"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search city or neighborhood"
                className="w-full pl-4 pr-12 py-2.5 rounded-md bg-gray-50 border border-gray-200"
            />


            <Button
                type="button"
                onClick={handleSearch}
                size="icon"
                className="absolute right-1"
            >
                <Search className="w-4 h-3"/>
            </Button>

        </div>
    );
}