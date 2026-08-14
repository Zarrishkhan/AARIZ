import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AARIZ | Modern Clothing",
    template: "%s | AARIZ",
  },
  description:
    "AARIZ — modern clothing designed for everyday confidence.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5f4f0] text-[#171717] antialiased">
        {children}
      </body>
    </html>
  );
}