import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartEco Admin",
  description: "SmartEco operations dashboard",
};

import { SearchProvider } from "@/context/search-context";
import { Toaster } from "@/components/ui/toaster";
import { RouteGuard } from "@/components/auth/route-guard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SearchProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </SearchProvider>
        <Toaster />
      </body>
    </html>
  );
}
