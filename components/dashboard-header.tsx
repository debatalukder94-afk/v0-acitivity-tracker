"use client"

import { Activity, Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFarcasterUser } from "@/hooks/use-farcaster"
import { DonationBox } from "@/components/donation-box"

interface DashboardHeaderProps {
  username: string
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { label: "Dashboard", tab: "social" },
  { label: "Growth", tab: "growth" },
  { label: "Activity Guide", tab: "guide" },
  { label: "Stats", tab: "stats" },
  { label: "Settings", tab: "settings" },
]

export function DashboardHeader({ username, activeTab, onTabChange }: DashboardHeaderProps) {
  const { user } = useFarcasterUser(username)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Logo with 3D pulse animation */}
        <div className="flex items-center gap-2 md:gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200/50 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 opacity-30 blur-lg animate-pulse-glow" />
          </div>
          <span className="hidden xs:block text-lg md:text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Activity Tracker
          </span>
        </div>

        {/* Navigation links - hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`text-sm transition-all duration-300 relative group py-1 ${
                activeTab === item.tab ? "text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full shadow-sm shadow-sky-300 transition-all duration-300 ${
                  activeTab === item.tab ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Right side with enhanced styling */}
        <div className="flex items-center gap-2 md:gap-3">
          <DonationBox />

          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-slate-100/80 transition-all duration-300 rounded-xl w-9 h-9 md:w-10 md:h-10"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full animate-pulse" />
          </Button>

          {/* User avatar */}
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200/50">
            <div className="relative group">
              {user?.pfp_url ? (
                <img
                  src={user.pfp_url || "/placeholder.svg"}
                  alt={user.display_name}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center ring-2 ring-white shadow-lg">
                  <span className="text-white text-xs md:text-sm font-bold">{username.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {/* Power badge indicator */}
              {user?.power_badge && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-white">
                  <Sparkles className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800">{user?.display_name || `@${username}`}</p>
              <p className="text-xs text-slate-400">@{username}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
