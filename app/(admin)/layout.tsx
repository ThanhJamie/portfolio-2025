import type { Metadata } from "next";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Panel | Portfolio",
  description: "Content management for portfolio",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
