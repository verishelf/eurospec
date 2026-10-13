import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EuroSpec Systems | Precision Automotive Technology",
  description:
    "EuroSpec Systems delivers expert diagnostics, maintenance, and performance services for European vehicles. Precision automotive technology you can trust.",
  keywords: [
    "EuroSpec",
    "European auto repair",
    "Audi service",
    "BMW service",
    "Mercedes service",
    "precision automotive",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
