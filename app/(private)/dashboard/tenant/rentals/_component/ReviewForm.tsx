"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/service/review.service";

interface ReviewFormProps {
    propertyId: string;
    onSubmitted: () => void;
    onCancel: () => void;
}

export default function ReviewForm({
    propertyId,
    onSubmitted,
    onCancel,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (rating === 0) {
            setError("Please select a star rating.");
            return;
        }

        if (comment.trim().length < 5) {
            setError("Please write a short comment about your stay.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await reviewService.createReview({
                propertyId,
                rating,
                comment: comment.trim(),
            });

            if (!res?.success) {
                throw new Error(res?.message ?? "Failed to submit review");
            }

            toast.success("Review submitted", {
                description: "Thanks for sharing your feedback!",
            });

            onSubmitted();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to submit review";
            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4 space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
                <p className="mb-2 text-sm font-medium">Your Rating</p>

                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                            <Star
                                className={`h-7 w-7 transition-colors ${
                                    star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-2 text-sm font-medium">Your Review</p>
                <Textarea
                    placeholder="Share your experience with this property and landlord..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
            </div>

            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>

                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                    {submitting && (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    )}
                    Submit Review
                </Button>
            </div>
        </div>
    );
}