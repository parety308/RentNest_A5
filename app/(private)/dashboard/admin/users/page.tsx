"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminService } from "@/service/adminService";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    isBanned?: boolean;
}

interface UsersMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

const ROLE_OPTIONS = ["ALL", "TENANT", "LANDLORD", "ADMIN"];

function getInitials(name?: string) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const AllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [meta, setMeta] = useState<UsersMeta>({
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 1,
    });

    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async (page: number, role: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminService.getAllUsers({
                page,
                limit: meta.limit,
                role: role === "ALL" ? undefined : role,
            });

            // Backend wraps as { success, message, data: { meta, data: users[] } }
            const list: User[] = Array.isArray(response)
                ? response
                : response?.data?.data || [];

            const responseMeta = Array.isArray(response)
                ? { page, limit: meta.limit, total: list.length, totalPage: 1 }
                : response?.data?.meta || {
                      page,
                      limit: meta.limit,
                      total: list.length,
                      totalPage: 1,
                  };

            setUsers(list);
            setMeta(responseMeta);
        } catch (err) {
            console.error("Failed to load users:", err);
            setError("Couldn't load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(1, roleFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleFilter]);

    const goToPage = (page: number) => {
        if (page < 1 || page > meta.totalPage) return;
        loadUsers(page, roleFilter);
    };

    const handleToggleBan = async (user: User) => {
        try {
            setActionLoadingId(user.id);

            const nextIsBanned = !user.isBanned;

            await adminService.updateUserStatus(user.id, {
                isBanned: nextIsBanned,
            });

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, isBanned: nextIsBanned } : u
                )
            );
        } catch (err) {
            console.error("Failed to update user status:", err);
            setError("Couldn't update that user's status. Please try again.");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        All Users
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {meta.total} registered {meta.total === 1 ? "user" : "users"}
                    </p>
                </div>

                {/* Role Filter */}
                <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                roleFilter === role
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                            }`}
                        >
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                        <td className="py-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-36" />
                                </div>
                            </div>
                        </td>
                        <td className="py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                        <td className="py-3 text-right"><Skeleton className="ml-auto h-7 w-16 rounded-lg" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
) : users.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No users found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="pb-3 font-medium">
                                            User
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Role
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Status
                                        </th>
                                        <th className="pb-3 font-medium text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                        {getInitials(
                                                            user.name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">
                                                            {user.name ||
                                                                "Unnamed User"}
                                                        </p>

                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3">
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                    {user.role || "TENANT"}
                                                </span>
                                            </td>

                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        user.isBanned
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {user.isBanned
                                                        ? "Banned"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                {user.role === "ADMIN" ? (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actionLoadingId ===
                                                            user.id
                                                        }
                                                        onClick={() =>
                                                            handleToggleBan(
                                                                user
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                            user.isBanned
                                                                ? "border-input bg-background hover:bg-muted"
                                                                : "border-transparent bg-red-600 text-white hover:bg-red-700"
                                                        }`}
                                                    >
                                                        {actionLoadingId ===
                                                        user.id ? (
                                                            "..."
                                                        ) : user.isBanned ? (
                                                            <>
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Unban
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ban className="h-4 w-4" />
                                                                Ban
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && meta.totalPage > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                            <p className="text-xs text-muted-foreground">
                                Page {meta.page} of {meta.totalPage}
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.page <= 1}
                                    onClick={() => goToPage(meta.page - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Prev
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.page >= meta.totalPage}
                                    onClick={() => goToPage(meta.page + 1)}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AllUsers;