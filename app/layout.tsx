import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folio / 01 — The Pocket Edition",
  description: "Small screen. Big ideas. An interactive pocket-sized portfolio of Alex Morgan, a fictional creative developer.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
