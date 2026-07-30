import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user";



interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium">{user.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{user.role}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={user.isBanned ? "destructive" : "default"}>
                {user.isBanned ? "Banned" : "Active"}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}