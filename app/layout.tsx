import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUME CAFE — Crafted to crave",
  description: "Real strawberry. Velvet cream. A small daily obsession. Explore LUME CAFE.",
  other: {
    "codex-preview": "development",
  },
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

