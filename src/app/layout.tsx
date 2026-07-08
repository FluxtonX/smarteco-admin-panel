import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartEco Admin",
  description: "SmartEco operations dashboard",
};

import { SearchProvider } from "@/context/search-context";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SearchProvider>
          {children}
        </SearchProvider>
        <Toaster />
      </body>
    </html>
  );
}
