import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Mono } from "next/font/google";
import { PosthogProvider } from "@/components/PosthogProvider";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Do you want AI in your life? 🤖",
  description:
    "Find your AI-vs-human archetype across everyday domains, then compare with a friend.",
  openGraph: {
    title: "Do you want AI in your life? 🤖",
    description:
      "Find your AI-vs-human archetype across everyday domains, then compare with a friend.",
    images: [
      {
        url: "/og-A@2x.png",
        width: 2400,
        height: 1260,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do you want AI in your life? 🤖",
    description:
      "Find your AI-vs-human archetype across everyday domains, then compare with a friend.",
    images: ["/og-A@2x.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${ibmPlexMono.variable} antialiased`}>
        <PosthogProvider>{children}</PosthogProvider>
      </body>
    </html>
  );
}
