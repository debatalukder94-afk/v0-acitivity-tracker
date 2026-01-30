import React from "react"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const username = params.username

  const fcFrameEmbed = JSON.stringify({
    version: "next",
    imageUrl: "https://activity-tracker.online/og-image.jpg",
    button: {
      title: "View Stats",
      action: {
        type: "launch_miniapp",
        name: "Activity Tracker",
        url: `https://activity-tracker.online/profile/${username}`,
        splashImageUrl: "https://activity-tracker.online/icon.png",
        splashBackgroundColor: "#0a1628",
      },
    },
  })

  return {
    title: `${username}'s Activity Card`,
    description: `Check ${username}'s Farcaster engagement stats on Activity Tracker`,
    openGraph: {
      title: `${username}'s Activity Card`,
      description: "Just checked my Farcaster engagement on Activity Tracker!",
      images: ["https://activity-tracker.online/og-image.jpg"],
    },
    other: {
      "fc:frame": fcFrameEmbed,
    },
  }
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
