import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "LinkHub - Your Personal Link-in-Bio Tool",
  description:
    "Create a beautiful landing page that houses all of your links and connect with your audience with just one link.",
  generator: "LinkHub",
  keywords: ["linktree", "bio link", "link in bio", "social media", "personal branding"],
  authors: [{ name: "LinkHub" }],
  openGraph: {
    title: "LinkHub - Your Personal Link-in-Bio Tool",
    description:
      "Create a beautiful landing page that houses all of your links and connect with your audience with just one link.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkHub - Your Personal Link-in-Bio Tool",
    description:
      "Create a beautiful landing page that houses all of your links and connect with your audience with just one link.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ErrorBoundary>
          {children}
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  )
}
