"use client"

import { useEffect, useState } from "react"

export function ActivityLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-24 h-24">
      {/* Animated recording indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
          <span className="text-orange-500 font-bold text-sm">REC</span>
        </div>
      </div>

      {/* Orbiting circles */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-400 rounded-full" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s" }}>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full" />
      </div>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] gap-6">
      <ActivityLoader />
      <div className="text-center space-y-2">
        <p className="text-slate-600 font-medium">{message}</p>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
