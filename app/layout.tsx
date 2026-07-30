import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Raleway } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "@/components/layout/footer";
import { getMe } from "@/service/getMe";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rent Nest",
  description: "Find & List Rental Properties with Ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full scroll-smooth antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        ralewayHeading.variable
      )}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar user={user} />

          <main className="flex-1">
            {children}
          </main>

          {/* Optional */}
          <Footer />

          <Toaster position="top-right" richColors />
        </div>
      </body>
    </html>
  );
}