"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight, HelpCircle, Activity, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PartnerLogos } from "@/components/partner-logos"
import { FloatingBubbles } from "@/components/floating-bubbles"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  onSubmit: (username: string) => void
}

export function HeroSection({ onSubmit }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue.trim().replace("@", ""))
    }
  }

  const socialProofUsers = [
    { initials: "JW", color: "bg-blue-500" },
    { initials: "MS", color: "bg-purple-500" },
    { initials: "ZR", color: "bg-pink-500" },
  ]

  const farcasterPlatforms = [
    { name: "TikTok", icon: "🎵", color: "text-black" },
    { name: "YouTube", icon: "▶️", color: "text-red-600" },
    { name: "Instagram", icon: "📸", color: "text-pink-600" },
    { name: "LinkedIn", icon: "in", color: "text-blue-600" },
    { name: "X", icon: "𝕏", color: "text-black" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/30 relative overflow-hidden">
      {/* Animated grid pattern background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "fill-sky-400/30 stroke-sky-400/30",
        )}
      />

      {/* Floating bubbles background */}
      <FloatingBubbles />

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-200/20 to-transparent blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/20 to-transparent blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      <div className="absolute top-20 left-10 w-24 h-32 bg-white rounded-lg shadow-lg opacity-60 transform -rotate-12 animate-float hidden md:block">
        <div className="p-2 h-full flex flex-col gap-1">
          <div className="h-2 bg-slate-200 rounded w-3/4"></div>
          <div className="h-2 bg-slate-200 rounded w-1/2"></div>
          <div className="flex-1 bg-gradient-to-br from-sky-100 to-indigo-100 rounded"></div>
        </div>
      </div>

      <div className="absolute top-32 right-12 w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-lg opacity-50 transform rotate-12 animate-float-slow hidden lg:block"></div>

      <div className="absolute bottom-20 left-20 w-32 h-24 bg-white rounded-lg shadow-lg opacity-60 transform rotate-6 animate-float hidden lg:block">
        <div className="p-2 h-full flex flex-col gap-2">
          <div className="h-3 bg-gradient-to-r from-sky-300 to-indigo-300 rounded w-full"></div>
          <div className="flex gap-1">
            <div className="h-2 bg-slate-200 rounded flex-1"></div>
            <div className="h-2 bg-slate-200 rounded flex-1"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full shadow-lg opacity-40 animate-bounce-soft hidden md:block"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="mb-8 flex items-center gap-3 group">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-sky-300/40 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Activity className="w-7 h-7 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 opacity-30 blur-xl animate-pulse-glow" />
            {/* Sparkle accent */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-bounce-soft" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Activity Tracker
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-balance">
          <span className="text-slate-800 drop-shadow-sm">Track Your </span>
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Farcaster Growth
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-500 text-center max-w-md mb-10 text-lg leading-relaxed">
          Real-time analytics, engagement insights, and growth tracking without needing to log in!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div
            className={`relative rounded-3xl p-6 transition-all duration-500 card-3d ${
              isFocused
                ? "bg-white shadow-[0_20px_60px_rgba(14,165,233,0.15)] border border-sky-200/50"
                : "bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50"
            }`}
          >
            {/* Inner gradient effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/30 pointer-events-none z-0" />

            {/* Input wrapper */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-inner transition-transform duration-300 hover:scale-110 hover:rotate-6">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Farcaster Activity</span>
              </div>

              <div className="relative">
                {/* Input field */}
                <Input
                  type="text"
                  placeholder="Enter your Farcaster username"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="h-14 text-lg rounded-2xl border-2 border-slate-100 bg-slate-50/80 px-5 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 neumorphic-inset relative z-10"
                />
                {inputValue && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-medium animate-in fade-in slide-in-from-right-2">
                    Ready!
                  </div>
                )}
              </div>

              {/* Example text */}
              <p className="text-xs text-slate-400 mt-2 ml-1">e.g., @vitalik or vitalik.eth</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400 text-sm group cursor-pointer">
            <HelpCircle className="w-4 h-4 group-hover:text-sky-500 transition-colors" />
            <span className="group-hover:text-slate-600 transition-colors">
              Need help? Learn how to find your username.
            </span>
          </div>

          <Button
            type="submit"
            className="w-full h-14 mt-6 rounded-2xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-xl shadow-sky-300/40 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-400/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg relative overflow-hidden group"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {socialProofUsers.map((user, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 ${user.color} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md`}
                >
                  {user.initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-800">10K+</span> trusted users
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Connected platforms</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {farcasterPlatforms.map((platform, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer border border-slate-100"
              >
                <span className="text-xl">{platform.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner logos */}
        <div className="mt-16">
          <p className="text-center text-xs text-slate-400 mb-4 uppercase tracking-wider font-medium">Powered by</p>
          <PartnerLogos />
        </div>
      </div>
    </div>
  )
}
