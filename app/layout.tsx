import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { SearchProvider } from "@/components/context/SearchContext"

export const metadata: Metadata = {
  title: "NEON Law Firm",
  description: "Professional legal services and consulting",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{
          
          fontFamily: "var(--font-mono), var(--font-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
          backgroundColor: "#fff",
          ["--font-sans" as any]: GeistSans.variable,
          ["--font-mono" as any]: GeistMono.variable,
        }}
      >
        <link rel="preload" href="/neon-logo.png" as="image" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  )
}
