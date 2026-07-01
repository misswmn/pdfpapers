import type { Metadata } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdfpapers.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "pdfpapers",
  title: {
    default: "pdfpapers — Free Custom Printable Paper",
    template: "%s | pdfpapers",
  },
  description: "Create personalized planners, family routines, study pages, and precise printable paper PDFs in your browser.",
  keywords: [
    "personalized printable",
    "printable planner",
    "custom routine chart",
    "graph paper PDF",
    "paper generator",
    "budget planner printable",
    "ADHD planner printable",
    "teacher planner printable",
    "nurse shift sheet printable",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Design your perfect page",
    description: "Personalize planners, routines, study pages, and precise printable paper.",
    type: "website",
    url: "/",
    siteName: "pdfpapers",
  },
  twitter: {
    card: "summary_large_image",
    title: "pdfpapers — Free Custom Printable Paper",
    description: "Create precise graph, lined, dot grid, and Cornell paper PDFs for free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
