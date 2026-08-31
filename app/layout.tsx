import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Viewport } from "next";
import { CinematicScrollProvider } from "@/components/motion/CinematicScrollProvider";
import { siteConfig } from "@/lib/constants";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "lenis/dist/lenis.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Web Developer Portfolio`,
  description:
    "Cinematic portfolio for Uzair Khurshid, a full-stack web developer with roots in WordPress, SEO, content, and real business systems.",
};

export const viewport: Viewport = {
  themeColor: "#020611",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CinematicScrollProvider>{children}</CinematicScrollProvider>
      </body>
    </html>
  );
}
