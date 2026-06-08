import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Back to School — Sponsorship Tracker",
  description:
    "Transparent tracking of school sponsorship payments for children in Pakistan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
