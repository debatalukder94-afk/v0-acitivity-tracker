import type React from "react"
import { cn } from "@/lib/utils"

interface StatBadgeProps {
  label: string
  value: string
  change?: string
  positive?: boolean
  icon?: React.ReactNode
}

export function StatBadge({ label, value, change, positive, icon }: StatBadgeProps) {
  return (
    <div className="relative p-3 md:p-5 rounded-xl md:rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden group hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</span>
          {icon && (
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-sky-600 shadow-sm shrink-0 ml-2">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
          <span className="text-xl md:text-3xl font-bold text-slate-800 group-hover:text-sky-700 transition-colors duration-300">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                "text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg truncate max-w-[80px] md:max-w-none",
                positive
                  ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
