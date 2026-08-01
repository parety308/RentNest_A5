
import {
    Building2,
    CheckCircle2,
    Clock3,
    DollarSign,
    Home,
    Plus,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
    {
        title: "My Properties",
        value: "12",
        description: "Total listed properties",
        icon: Building2,
    },
    {
        title: "Active Rentals",
        value: "8",
        description: "Currently rented",
        icon: Home,
    },
    {
        title: "Pending Requests",
        value: "5",
        description: "Need your review",
        icon: Clock3,
    },
    {
        title: "Monthly Earnings",
        value: "$4,850",
        description: "From active rentals",
        icon: DollarSign,
    },
];

const rentalRequests = [
    {
        name: "John Doe",
        property: "Modern 2 Bedroom Apartment",
        date: "Today",
        status: "Pending",
    },
    {
        name: "Sarah Ahmed",
        property: "Family House",
        date: "Yesterday",
        status: "Approved",
    },
    {
        name: "Michael Smith",
        property: "Downtown Studio",
        date: "2 days ago",
        status: "Pending",
    },
];

const properties = [
    {
        name: "Modern 2 Bedroom Apartment",
        location: "Chattogram",
        rent: "$650/month",
        status: "Rented",
    },
    {
        name: "Family House",
        location: "Dhaka",
        rent: "$900/month",
        status: "Available",
    },
    {
        name: "Downtown Studio",
        location: "Chattogram",
        rent: "$450/month",
        status: "Rented",
    },
];

const LandlordDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Landlord Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your properties, tenants, and rental requests.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/dashboard/landlord/properties/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>

                                <Icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Rental Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Rental Requests</CardTitle>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/landlord/requests">
                                View All
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            {rentalRequests.map((request) => (
                                <div
                                    key={`${request.name}-${request.property}`}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {request.name}
                                        </p>

                                        <p className="truncate text-sm text-muted-foreground">
                                            {request.property}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {request.date}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                            request.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Earnings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Earnings</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-6">
                            <p className="text-3xl font-bold">
                                $4,850
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Estimated earnings this month
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Collected Rent</span>
                                    <span className="font-medium">
                                        $4,200
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 w-[86%] rounded-full bg-primary" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Pending Rent</span>
                                    <span className="font-medium">
                                        $650
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 w-[35%] rounded-full bg-primary" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Properties */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Properties</CardTitle>

                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/landlord/properties">
                            Manage Properties
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {properties.map((property) => (
                            <div
                                key={property.name}
                                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Building2 className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            {property.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {property.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-6 sm:justify-end">
                                    <span className="text-sm font-medium">
                                        {property.rent}
                                    </span>

                                    <span
                                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                            property.status === "Rented"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {property.status === "Rented" && (
                                            <CheckCircle2 className="h-3 w-3" />
                                        )}

                                        {property.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LandlordDashboard;
