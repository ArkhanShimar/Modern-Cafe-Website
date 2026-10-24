import type { Metadata } from "next";
import "./globals.css";
import "./refinements.css";

export const metadata: Metadata = {
  title: "LUME CAFE — Crafted to crave",
  description: "Your little corner of Colombo. Discover LUME CAFE: espresso, signature frappés, Ceylon tea, breakfast and bakes, made for your everyday.",
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
    <html lang="en-LK" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('lume-theme')==='light'?'light':'dark';document.documentElement.dataset.motion=localStorage.getItem('lume-motion')==='reduced'?'reduced':'full'}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.motion='full'}" }} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

