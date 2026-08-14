
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AARIZ | Men's & Women's Clothing",
  description:
    "AARIZ — modern clothing for men and women. Explore our latest clothing collection.",
  keywords: [
    "AARIZ",
    "AARIZ clothing",
    "AARIZ Pakistan",
    "men clothing",
    "women clothing",
    "Pakistani clothing",
    "fashion",
    "clothing store",
  ],
  authors: [
    {
      name: "AARIZ",
    },
  ],
  creator: "AARIZ",
  publisher: "AARIZ",

  metadataBase: new URL("https://aariz-weld.vercel.app"),

  openGraph: {
    title: "AARIZ | Men's & Women's Clothing",
    description:
      "Explore the latest AARIZ clothing collection for men and women.",
    url: "https://aariz-weld.vercel.app",
    siteName: "AARIZ",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "AARIZ | Men's & Women's Clothing",
    description:
      "Explore the latest AARIZ clothing collection for men and women.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


