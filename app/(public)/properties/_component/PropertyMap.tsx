import { Card, CardContent } from "@/components/ui/card";

interface Props {
  address: string;
}

export default function PropertyMap({ address }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Location</h2>

        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            address
          )}&output=embed`}
          className="h-[420px] w-full rounded-xl border"
          loading="lazy"
        />
      </CardContent>
    </Card>
  );
}