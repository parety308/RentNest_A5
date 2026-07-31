import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user";



interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="container mx-auto max-w-4xl py-10">
  <Card className="overflow-hidden border shadow-lg">
    {/* Header */}
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarFallback className="text-3xl font-bold">
            {user?.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-3xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground mt-1">{user?.email}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge className="px-3 py-1">{user?.role}</Badge>

            <Badge
              variant={user?.isBanned ? "destructive" : "secondary"}
              className="px-3 py-1"
            >
              {user?.isBanned ? "Banned" : "Active"}
            </Badge>
          </div>
        </div>
      </div>
    </div>

    <CardContent className="p-8">
      <div className="grid gap-5 md:grid-cols-2">

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="mt-2 font-medium break-all">{user?.id}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-2 font-semibold">{user?.role}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="mt-2 font-medium">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="mt-2 font-medium">
              {new Date(user?.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

      </div>
    </CardContent>
  </Card>
</div>
  );
}