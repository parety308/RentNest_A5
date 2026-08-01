import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Rent Nest",
  description: "Find & List Rental Properties with Ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}
         <Toaster/>
      </body>
     
    </html>
  );
}