import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./shared/Navbar/Navbar";

const ralewayHeading = Raleway({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, ralewayHeading.variable)}
    >
      <body className="min-h-full flex flex-col max-w-7xl mx-auto">
        <Navbar/>
        {children}
        <Toaster position="top-right" richColors/>
        </body>
    </html>
  );
}
