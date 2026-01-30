"use client"

import { MessageCircle, BarChart3, Lightbulb, Settings, Sparkles, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "social", icon: MessageCircle, label: "Social Activity", color: "from-sky-400 to-blue-500" },
  { id: "growth", icon: TrendingUp, label: "Growth", color: "from-violet-400 to-purple-500" },
  { id: "stats", icon: BarChart3, label: "Stats", color: "from-emerald-400 to-teal-500" },
  { id: "guide", icon: Lightbulb, label: "Guide", color: "from-amber-400 to-orange-500" },
  { id: "settings", icon: Settings, label: "Settings", color: "from-slate-400 to-slate-500" },
]

export function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 min-h-[calc(100vh-73px)] bg-white/60 backdrop-blur-sm border-r border-slate-100/50 p-5">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group",
              activeTab === item.id
                ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                : "text-slate-600 hover:bg-slate-100/80",
            )}
          >
            {/* Background glow for active state */}
            {activeTab === item.id && <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-100`} />}

            {/* Icon with 3D effect */}
            <div
              className={cn(
                "relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                activeTab === item.id
                  ? "bg-white/20 shadow-inner"
                  : "bg-slate-100 group-hover:bg-slate-200 group-hover:scale-105",
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-slate-500")} />
            </div>

            <span className={cn("font-medium relative z-10", activeTab === item.id ? "text-white" : "text-slate-700")}>
              {item.label}
            </span>

            {/* Arrow indicator for active */}
            {activeTab === item.id && (
              <div className="ml-auto relative z-10">
                <div className="w-2 h-2 rounded-full bg-white/50" />
              </div>
            )}

            {/* Hover shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          </button>
        ))}
      </nav>

      {/* Divider with gradient */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Quick tip card with 3D floating effect */}
      <div className="mt-auto p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-100/50 shadow-lg shadow-indigo-100/30 card-3d">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Quick Tip</span>
          <Sparkles className="w-3 h-3 text-amber-400 ml-auto" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Post consistently during peak hours to boost your engagement by up to{" "}
          <span className="font-bold text-emerald-600">40%</span>!
        </p>

        {/* Mini progress indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
          </div>
          <span className="text-xs text-slate-400">75%</span>
        </div>
      </div>

      {/* Level up banner */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Level Up!</span>
          </div>
          <p className="text-sm font-semibold">{"You're"} 23% away from Power Badge</p>
        </div>
      </div>
    </aside>
  )
}
