import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
          <div className="rounded-full bg-primary/10 p-5">
            <Search className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Sorry, the page you are looking for does not exist or may have been
              moved.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/properties">
                Browse Properties
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}