import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/types/property";

interface Props {
  reviews: Review[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

export default function PropertyReviews({ reviews }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No reviews yet. Be the first to share your experience after your
            stay.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-none">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(review.tenant.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold">{review.tenant.name}</h3>

                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}