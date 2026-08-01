"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface PlatformSettings {
    siteName: string;
    supportEmail: string;
    allowNewSignups: boolean;
    requireLandlordApproval: boolean;
    autoApproveRentals: boolean;
    maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
    siteName: "RentNest",
    supportEmail: "support@rentnest.com",
    allowNewSignups: true,
    requireLandlordApproval: true,
    autoApproveRentals: false,
    maintenanceMode: false,
};

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                checked ? "bg-primary" : "bg-muted"
            }`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}

const AdminSettings = () => {
    const [settings, setSettings] =
        useState<PlatformSettings>(DEFAULT_SETTINGS);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    const updateField = <K extends keyof PlatformSettings>(
        key: K,
        value: PlatformSettings[K]
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setSavedMessage(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedMessage(null);

        // TODO: replace with adminService.updateSettings(settings)
        // once a backend route exists.
        await new Promise((resolve) => setTimeout(resolve, 500));

        setSaving(false);
        setSavedMessage("Saved locally — no backend endpoint yet.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage platform-wide configuration for RentNest.
                </p>
            </div>

            {/* General */}
            <Card>
                <CardHeader>
                    <CardTitle>General</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">
                            Site Name
                        </label>

                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) =>
                                updateField("siteName", e.target.value)
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">
                            Support Email
                        </label>

                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) =>
                                updateField("supportEmail", e.target.value)
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Access & Approvals */}
            <Card>
                <CardHeader>
                    <CardTitle>Access &amp; Approvals</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">
                                Allow new signups
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Let new tenants and landlords register.
                            </p>
                        </div>

                        <Toggle
                            checked={settings.allowNewSignups}
                            onChange={() =>
                                updateField(
                                    "allowNewSignups",
                                    !settings.allowNewSignups
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">
                                Require landlord approval
                            </p>
                            <p className="text-xs text-muted-foreground">
                                New landlord accounts must be approved by an
                                admin before listing properties.
                            </p>
                        </div>

                        <Toggle
                            checked={settings.requireLandlordApproval}
                            onChange={() =>
                                updateField(
                                    "requireLandlordApproval",
                                    !settings.requireLandlordApproval
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">
                                Auto-approve rental requests
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Skip manual review for new rental requests.
                            </p>
                        </div>

                        <Toggle
                            checked={settings.autoApproveRentals}
                            onChange={() =>
                                updateField(
                                    "autoApproveRentals",
                                    !settings.autoApproveRentals
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        Danger Zone
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">
                                Maintenance mode
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Take the platform offline for everyone except
                                admins.
                            </p>
                        </div>

                        <Toggle
                            checked={settings.maintenanceMode}
                            onChange={() =>
                                updateField(
                                    "maintenanceMode",
                                    !settings.maintenanceMode
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Bar */}
            <div className="flex items-center justify-end gap-3">
                {savedMessage && (
                    <p className="text-xs text-muted-foreground">
                        {savedMessage}
                    </p>
                )}

                <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-1.5 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default AdminSettings;