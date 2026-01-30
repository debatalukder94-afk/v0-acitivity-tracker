"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SocialActivitySection } from "@/components/social-activity-section"
import { StatsSection } from "@/components/stats-section"
import { GuideSection } from "@/components/guide-section"
import { SettingsSection } from "@/components/settings-section"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"
import { GrowthSection } from "@/components/growth-section"

interface DashboardProps {
  username: string
  onLogout: () => void
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("social")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 relative pb-24 lg:pb-0">
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.05}
        duration={4}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "fill-indigo-400/20 stroke-indigo-400/20",
        )}
      />

      {/* Subtle background orbs */}
      <div className="fixed top-20 right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-sky-100/30 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100 116 139) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <DashboardHeader username={username} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex relative">
        {/* Side navigation - desktop only */}
        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "social" && <SocialActivitySection username={username} />}
            {activeTab === "growth" && <GrowthSection username={username} />}
            {activeTab === "stats" && <StatsSection username={username} />}
            {activeTab === "guide" && <GuideSection username={username} />}
            {activeTab === "settings" && <SettingsSection username={username} onLogout={onLogout} />}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
