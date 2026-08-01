"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Adjust to match your actual API base url / client setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

interface Category {
    id: string;
    name: string;
}

interface FormState {
    title: string;
    description: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    amenities: string;
    images: string;
    availableFrom: string;
    categoryId: string;
}

const initialState: FormState = {
    title: "",
    description: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    amenities: "",
    images: "",
    availableFrom: "",
    categoryId: "",
};

const CreateProperties = () => {
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialState);
    const [categories, setCategories] = useState<Category[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`, {
                    credentials: "include",
                });
                if (!res.ok) return;
                const json = await res.json();
                setCategories(json?.data ?? []);
            } catch {
            }
        };

        loadCategories();
    }, []);

    const handleChange = (
        field: keyof FormState,
        value: string
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.title || !form.description || !form.address || !form.city || !form.state || !form.price || !form.categoryId) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                title: form.title,
                description: form.description,
                address: form.address,
                neighborhood: form.neighborhood || undefined,
                city: form.city,
                state: form.state,
                zipCode: form.zipCode || undefined,
                price: Number(form.price),
                bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
                bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
                sqft: form.sqft ? Number(form.sqft) : undefined,
                amenities: form.amenities
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                images: form.images
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                available: true,
                availableFrom: form.availableFrom || undefined,
                categoryId: form.categoryId,
            };

            const res = await fetch(`${API_BASE_URL}/landlord/properties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok || !json?.success) {
                throw new Error(json?.message ?? "Failed to create property");
            }

            router.push("/dashboard/landlord/properties");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/landlord"
                        className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Add Property
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        List a new property for rent.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Give tenants a clear picture of the property.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Modern 2 Bedroom Apartment"
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the property, its condition, and highlights..."
                                rows={4}
                                value={form.description}
                                onChange={(e) =>
                                    handleChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={form.categoryId}
                                onValueChange={(value) =>
                                    handleChange("categoryId", value)
                                }
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>

                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                        <CardDescription>
                            Where is this property located?
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                placeholder="123 Main Street"
                                value={form.address}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="neighborhood">
                                Neighborhood
                            </Label>
                            <Input
                                id="neighborhood"
                                placeholder="Panchlaish"
                                value={form.neighborhood}
                                onChange={(e) =>
                                    handleChange(
                                        "neighborhood",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                placeholder="Chattogram"
                                value={form.city}
                                onChange={(e) =>
                                    handleChange("city", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                placeholder="Chattogram Division"
                                value={form.state}
                                onChange={(e) =>
                                    handleChange("state", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                                id="zipCode"
                                placeholder="4000"
                                value={form.zipCode}
                                onChange={(e) =>
                                    handleChange("zipCode", e.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                        <CardDescription>
                            Pricing and physical specifications.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Monthly Rent ($) *</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                placeholder="650"
                                value={form.price}
                                onChange={(e) =>
                                    handleChange("price", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                min="0"
                                placeholder="2"
                                value={form.bedrooms}
                                onChange={(e) =>
                                    handleChange("bedrooms", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                min="0"
                                placeholder="1"
                                value={form.bathrooms}
                                onChange={(e) =>
                                    handleChange("bathrooms", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sqft">Square Feet</Label>
                            <Input
                                id="sqft"
                                type="number"
                                min="0"
                                placeholder="850"
                                value={form.sqft}
                                onChange={(e) =>
                                    handleChange("sqft", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="amenities">
                                Amenities
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                    (comma separated)
                                </span>
                            </Label>
                            <Input
                                id="amenities"
                                placeholder="Parking, Wi-Fi, Air Conditioning"
                                value={form.amenities}
                                onChange={(e) =>
                                    handleChange("amenities", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="availableFrom">
                                Available From
                            </Label>
                            <Input
                                id="availableFrom"
                                type="date"
                                value={form.availableFrom}
                                onChange={(e) =>
                                    handleChange(
                                        "availableFrom",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                            <Label htmlFor="images">
                                Image URLs
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                    (comma separated)
                                </span>
                            </Label>
                            <Textarea
                                id="images"
                                rows={2}
                                placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                                value={form.images}
                                onChange={(e) =>
                                    handleChange("images", e.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <p className="text-sm font-medium text-destructive">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/landlord")}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" disabled={submitting}>
                        {submitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {submitting ? "Creating..." : "Create Property"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProperties;