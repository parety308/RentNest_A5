
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Heart,
    Home,
    MessageSquare,
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
        title: "Active Rental",
        value: "1",
        description: "Currently rented property",
        icon: Home,
    },
    {
        title: "Rental Requests",
        value: "4",
        description: "Total requests submitted",
        icon: Clock3,
    },
    {
        title: "Saved Properties",
        value: "8",
        description: "Properties you're interested in",
        icon: Heart,
    },
    {
        title: "Next Payment",
        value: "$650",
        description: "Due in 12 days",
        icon: CalendarDays,
    },
];

const rentalRequests = [
    {
        property: "Modern 2 Bedroom Apartment",
        location: "Chattogram",
        date: "Aug 1, 2026",
        status: "Pending",
    },
    {
        property: "Family House",
        location: "Dhaka",
        date: "Jul 28, 2026",
        status: "Approved",
    },
    {
        property: "Downtown Studio",
        location: "Chattogram",
        date: "Jul 25, 2026",
        status: "Rejected",
    },
];

const TenantDashBoard = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Tenant Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your rentals, requests, and favorite properties.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/properties">
                        <Building2 className="mr-2 h-4 w-4" />
                        Browse Properties
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

            {/* Current Rental + Payment */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Current Rental */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Rental</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-lg border p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <Home className="h-6 w-6" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                Modern 2 Bedroom Apartment
                                            </h3>

                                            <p className="text-sm text-muted-foreground">
                                                Chattogram, Bangladesh
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                            Active
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Monthly Rent
                                            </p>

                                            <p className="mt-1 font-semibold">
                                                $650
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-muted-foreground">
                                                Lease Ends
                                            </p>

                                            <p className="mt-1 font-semibold">
                                                Dec 31, 2026
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button size="sm" asChild>
                                    <Link href="/dashboard/tenant/rentals">
                                        View Rental
                                    </Link>
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/dashboard/tenant/messages">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Contact Landlord
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Payment</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold">
                                    $650
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Monthly rent
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Due Date
                                </span>

                                <span className="text-sm font-medium">
                                    August 13, 2026
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Status
                                </span>

                                <span className="text-sm font-medium text-yellow-600">
                                    Due Soon
                                </span>
                            </div>
                        </div>

                        <Button className="mt-4 w-full">
                            View Payment Details
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Rental Requests */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Rental Requests</CardTitle>

                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/tenant/requests">
                            View All
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {rentalRequests.map((request) => (
                            <div
                                key={`${request.property}-${request.date}`}
                                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Building2 className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            {request.property}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {request.location}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Requested {request.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                    <span
                                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                            request.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : request.status === "Rejected"
                                                  ? "bg-red-100 text-red-700"
                                                  : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {request.status === "Approved" && (
                                            <CheckCircle2 className="h-3 w-3" />
                                        )}

                                        {request.status === "Pending" && (
                                            <Clock3 className="h-3 w-3" />
                                        )}

                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Find a Property
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Explore available rentals
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                            <Heart className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Saved Properties
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                View your favorite properties
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Messages
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Contact your landlords
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TenantDashBoard;

