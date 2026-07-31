import ProfilePage from "@/components/ProfilePage";
import { getMe } from "@/service/getMe";

export default async function Page() {
  const user = await getMe();

  return <ProfilePage user={user?.data} />;
}