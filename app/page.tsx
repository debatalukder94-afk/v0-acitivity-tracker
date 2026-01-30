"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { Dashboard } from "@/components/dashboard"
import { FarcasterProvider, useFarcasterSDK } from "@/components/farcaster-provider"

function AppContent() {
  const [username, setUsername] = useState<string | null>(null)
  const { isReady, user, isInMiniApp } = useFarcasterSDK()

  useEffect(() => {
    if (isInMiniApp && user?.username && !username) {
      setUsername(user.username)
    }
  }, [isInMiniApp, user, username])

  // Show loading state while SDK initializes
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm">Loading Activity Tracker...</p>
        </div>
      </div>
    )
  }

  if (username) {
    return <Dashboard username={username} onLogout={() => setUsername(null)} />
  }

  return <HeroSection onSubmit={setUsername} />
}

export default function Home() {
  return (
    <FarcasterProvider>
      <AppContent />
    </FarcasterProvider>
  )
}
