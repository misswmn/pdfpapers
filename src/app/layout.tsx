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

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfpapers.com"),
  title: { default: "pdfpapers — Free Custom Printable Paper", template: "%s | pdfpapers" },
  description: "Create precise graph, lined, dot grid, and Cornell paper PDFs for free. Customize size, spacing, weight, and color in your browser.",
  keywords: ["printable paper", "graph paper PDF", "lined paper", "Cornell notes template", "paper generator"],
  openGraph: { title: "Design your perfect page", description: "Free custom printable paper generators.", type: "website" },
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
