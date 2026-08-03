import { z } from "zod";

export const rentalRequestSchema = z
    .object({
        startDate: z.string().min(1, "Move-in date is required"),
        endDate: z.string().optional(),
        message: z
            .string()
            .min(10, "Tell the landlord a bit about yourself (min 10 characters)")
            .max(500, "Message is too long"),
    })
    .refine(
        (data) =>
            !data.endDate || new Date(data.endDate) > new Date(data.startDate),
        {
            message: "Move-out date must be after the move-in date",
            path: ["endDate"],
        }
    );

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;