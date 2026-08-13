import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AARIZ",
  description: "AARIZ Clothing",
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