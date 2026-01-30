"use client"

import { MessageCircle, BarChart3, Lightbulb, Settings, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "social", icon: MessageCircle, label: "Social", color: "from-sky-400 to-blue-500" },
  { id: "growth", icon: TrendingUp, label: "Growth", color: "from-violet-400 to-purple-500" },
  { id: "stats", icon: BarChart3, label: "Stats", color: "from-emerald-400 to-teal-500" },
  { id: "guide", icon: Lightbulb, label: "Guide", color: "from-amber-400 to-orange-500" },
  { id: "settings", icon: Settings, label: "Settings", color: "from-slate-400 to-slate-500" },
]

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[64px]",
              activeTab === item.id ? "text-white" : "text-slate-400 hover:text-slate-600",
            )}
          >
            {/* Icon container with gradient background when active */}
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                activeTab === item.id ? `bg-gradient-to-r ${item.color} shadow-lg` : "bg-slate-100",
              )}
            >
              <item.icon
                className={cn("w-5 h-5 transition-colors", activeTab === item.id ? "text-white" : "text-slate-500")}
              />
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                activeTab === item.id ? "text-slate-800" : "text-slate-400",
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
