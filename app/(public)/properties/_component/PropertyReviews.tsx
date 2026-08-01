import Image from "next/image";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/property";

interface Props {
  reviews: Review[];
}

export default function PropertyReviews({ reviews }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>

        <div className="mt-8 space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-none">
              <div className="flex items-center gap-4">
                <Image
                  src={review.avatar}
                  alt={review.user}
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <div>
                  <h3 className="font-semibold">{review.user}</h3>

                  <div className="flex mt-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground leading-7">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}