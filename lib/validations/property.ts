import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(20, "Description should be at least 20 characters"),
  address: z.string().min(3, "Address is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0, "Can't be negative"),
  bathrooms: z.coerce.number().int().min(0, "Can't be negative"),
  sqft: z.coerce.number().int().positive("Sqft must be a positive number"),
  images: z.array(z.string().url()).min(1, "Upload at least one image"),
  amenities: z.array(z.string()).default([]),
  available: z.boolean(),
  availableFrom: z.string().optional().nullable(),
});

export type PropertyFormInput = z.infer<typeof propertySchema>;