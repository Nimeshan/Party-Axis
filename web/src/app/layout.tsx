import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0d0f14",
};

export const metadata: Metadata = {
  title: {
    template: "%s · Party Axis",
    default: "Party Axis · Where nightlife finds gravity",
  },
  description:
    "Singapore-first party & venue listings — curated highlights, moderated publishing, weekend discovery.",
  ...(process.env.NEXT_PUBLIC_SITE_URL?.trim()
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL.trim()) }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${inter.className}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-[100vh] min-h-[100dvh] antialiased">{children}</body>
    </html>
  );
}
