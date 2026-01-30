import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const fcFrameEmbed = JSON.stringify({
  version: "next",
  imageUrl: "https://activity-tracker.online/frame.png",
  button: {
    title: "Track Activity",
    action: {
      type: "launch_miniapp",
      name: "Activity Tracker",
      url: "https://activity-tracker.online/",
      splashImageUrl: "https://activity-tracker.online/icon.png",
      splashBackgroundColor: "#0a1628",
    },
  },
})

export const metadata: Metadata = {
  title: "Activity Tracker | Track Your Farcaster & Base Activity",
  description:
    "Track your Farcaster social activity and Base wallet transactions without needing to log in. Get personalized tips to improve your engagement.",
  generator: "v0.app",
  openGraph: {
    title: "Activity Tracker | Track Your Farcaster Activity",
    description:
      "Track your Farcaster social activity without needing to log in. Get personalized tips to improve your engagement.",
    url: "https://activity-tracker.online/",
    siteName: "Activity Tracker",
    images: [
      {
        url: "https://activity-tracker.online/cover.png",
        width: 1500,
        height: 500,
        alt: "Activity Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Activity Tracker | Track Your Farcaster Activity",
    description: "Track your Farcaster social activity without needing to log in.",
    images: ["https://activity-tracker.online/cover.png"],
  },
  other: {
    "base:app_id": "6961559cb8395f034ac22002",
    "fc:frame": fcFrameEmbed,
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a1628",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
