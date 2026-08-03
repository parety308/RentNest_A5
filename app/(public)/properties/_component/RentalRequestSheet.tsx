"use client";

import { useState, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";

import { rentalRequestSchema } from "@/app/lib/validations/rental";
import { CreateRentalRequest } from "@/service/rental.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    propertyId: string;
    propertyTitle: string;
    availableFrom?: string | null;
    onSuccess: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function RentalRequestSheet({
    open,
    onOpenChange,
    propertyId,
    propertyTitle,
    availableFrom,
    onSuccess,
}: Props) {
    const availableFromDate = availableFrom ? availableFrom.slice(0, 10) : null;
    const minStartDate =
        availableFromDate && availableFromDate > todayISO()
            ? availableFromDate
            : todayISO();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState(
        `Hi, I'm interested in renting "${propertyTitle}". Please let me know if it's still available.`
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const resetAndClose = () => {
        setStartDate("");
        setEndDate("");
        setErrors({});
        onOpenChange(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const parsed = rentalRequestSchema.safeParse({
            startDate,
            endDate: endDate || undefined,
            message,
        });

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0] as string;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setSubmitting(true);

        try {
            await CreateRentalRequest({
                propertyId,
                message: parsed.data.message,
                startDate: parsed.data.startDate,
                endDate: parsed.data.endDate,
            });

            toast.success("Rental request sent!", {
                description: "The landlord will review your request shortly.",
            });

            onSuccess();
            resetAndClose();
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to send request";

            toast.error(
                msg.includes("active request")
                    ? "You already have a pending or active request for this property."
                    : msg
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Request to Rent</SheetTitle>
                    <SheetDescription>
                        Let the landlord know when you&apos;d like to move in.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="startDate">Move-in date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                min={minStartDate}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                            <FieldError>{errors.startDate}</FieldError>
                        </Field>

                        <Field>
                            <Label htmlFor="endDate">Move-out (optional)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                min={startDate || minStartDate}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <FieldError>{errors.endDate}</FieldError>
                        </Field>
                    </div>

                    <Field>
                        <Label htmlFor="message">Message to landlord</Label>
                        <Textarea
                            id="message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <FieldError>{errors.message}</FieldError>
                    </Field>

                    <SheetFooter className="mt-auto flex-row justify-end gap-2 p-0 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetAndClose}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={submitting}>
                            {submitting && (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            )}
                            Send Request
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}