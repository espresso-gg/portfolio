import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Uzair Khurshid — Creative Developer in Islamabad, Pakistan",
    description: "Creative developer crafting digital worlds, visual systems, and thoughtful interfaces from Islamabad, Pakistan.",
    openGraph: {
      title: "Uzair Khurshid — Creative Developer in Islamabad, Pakistan",
      description: "Digital experiences, composed beneath a quieter sky.",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1732,
          height: 908,
          alt: "Uzair Khurshid — Creative Developer in Islamabad, Pakistan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Uzair Khurshid — Creative Developer in Islamabad, Pakistan",
      description: "Digital experiences, composed beneath a quieter sky.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-loaded">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Figtree:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
