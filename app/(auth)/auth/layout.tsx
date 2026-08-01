import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/footer";
import { getMe } from "@/service/getMe";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}