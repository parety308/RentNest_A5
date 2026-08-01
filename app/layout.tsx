import type { Metadata } from "next";

import "./globals.css";


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
      <body>{children}</body>
    </html>
  );
}