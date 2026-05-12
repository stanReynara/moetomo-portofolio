import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Single source of truth from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL || '';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Moetomo",
  description: "Moetomo's Portfolio",
  openGraph: {
    title: "Moetomo",
    description: "Moetomo's Portfolio",
    images: [
      {
        url: `${BUCKET_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Moetomo",
    description: "Moetomo's Portfolio",
    images: [
      {
        url: `${BUCKET_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#A0C5F8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100`}
      >
        {children}
      </body>
    </html>
  );
}