"use client"

import { useParams } from "next/navigation"
import { ActivityMiniAppCard } from "@/components/activity-mini-app-card"

export default function ProfileSharePage() {
  const params = useParams()
  const username = params.username as string

  return <ActivityMiniAppCard username={username} />
}
