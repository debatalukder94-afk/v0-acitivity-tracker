"use client"

import { Download, Share2 } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import type { NeynarUser } from "@/lib/neynar"
import { formatNumber } from "@/hooks/use-farcaster"

interface TopEngager {
  username: string
  display_name: string
  pfp_url?: string
  engagement_score: number
  rank: number
}

interface ActivityCardProps {
  user: NeynarUser
  engagementRate: number
  totalLikes: number
  totalRecasts: number
  totalReplies: number
  topEngagers?: TopEngager[]
}

export function ActivityCard({
  user,
  engagementRate,
  totalLikes,
  totalRecasts,
  totalReplies,
  topEngagers = [],
}: ActivityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const getRankBadge = (rank: number) => {
    const badges = ["🥇", "🥈", "🥉"]
    return badges[rank - 1] || `#${rank}`
  }

  const avgEngagement = Math.round((totalLikes + totalRecasts + totalReplies) / 3)

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 2,
        logging: false,
      })

      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `activity-card-${user.username}-${Date.now()}.png`
      link.click()
    } catch (error) {
      console.error("[v0] Failed to download card:", error)
    }
  }

  const handleShare = () => {
    const text = `Just generated my Activity Card! 
👤 @${user.username}
🎯 Avg Engagement: ${avgEngagement}
❤️ ${formatNumber(totalLikes)} likes
🔄 ${formatNumber(totalRecasts)} recasts
💬 ${formatNumber(totalReplies)} replies

#Farcaster #ActivityTracker`

    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card Container - Mobile First Design */}
      <div
        ref={cardRef}
        className="relative w-full bg-gradient-to-b from-[#C4B5FD] via-[#E9D5FF] to-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />

        {/* Frosted Glass Card Content */}
        <div className="absolute inset-0 flex flex-col p-6 gap-5">
          {/* TOP SECTION - User Profile */}
          <div className="backdrop-blur-md bg-[#EFF6FF]/80 rounded-2xl p-5 border border-white/60 shadow-lg">
            {/* User Avatar with Glow */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-300/40 blur-xl rounded-full" />
                {user.pfp_url && (
                  <img
                    src={user.pfp_url || "/placeholder.svg"}
                    alt={user.username}
                    className="relative w-14 h-14 rounded-full border-2 border-white/80 object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{user.display_name}</p>
                <p className="text-xs text-slate-600">@{user.username}</p>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="text-center py-3 bg-white/50 rounded-xl">
              <p className="text-xs text-slate-600 font-medium mb-1">Average Engagement Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                {avgEngagement}
              </p>
              <p className="text-xs text-slate-500 mt-1">Based on last 30 days</p>
            </div>
          </div>

          {/* MIDDLE SECTION - Daily Activity Stats */}
          <div className="backdrop-blur-md bg-[#EFF6FF]/80 rounded-2xl p-4 border border-white/60 shadow-lg">
            <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Daily Activity</p>
            <div className="grid grid-cols-3 gap-3">
              {/* Casts */}
              <div className="bg-white/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 mb-1">Casts</p>
                <p className="text-xl font-bold text-slate-800">{formatNumber(totalRecasts)}</p>
              </div>

              {/* Recasts */}
              <div className="bg-white/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 mb-1">Recasts</p>
                <p className="text-xl font-bold text-slate-800">{formatNumber(totalLikes)}</p>
              </div>

              {/* Replies */}
              <div className="bg-white/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 mb-1">Replies</p>
                <p className="text-xl font-bold text-slate-800">{formatNumber(totalReplies)}</p>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION - Top Engaging Users */}
          <div className="backdrop-blur-md bg-[#EFF6FF]/80 rounded-2xl p-4 border border-white/60 shadow-lg flex-1 flex flex-col">
            <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Top Engagers</p>

            {topEngagers.length > 0 ? (
              <div className="space-y-2 flex-1">
                {topEngagers.slice(0, 3).map((engager, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/50 rounded-lg p-2.5">
                    <div className="text-lg font-bold text-violet-600">{getRankBadge(engager.rank)}</div>

                    {engager.pfp_url && (
                      <img
                        src={engager.pfp_url || "/placeholder.svg"}
                        alt={engager.username}
                        className="w-8 h-8 rounded-full border border-white/60 object-cover"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{engager.display_name}</p>
                      <p className="text-xs text-slate-500 truncate">@{engager.username}</p>
                    </div>

                    <p className="text-xs font-bold text-violet-600 whitespace-nowrap">{engager.engagement_score}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-slate-500 text-center">No engagement data available</p>
              </div>
            )}
          </div>

          {/* FOOTER - Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Share2 className="w-5 h-5" />
          Share Your Card
        </button>
      </div>
    </div>
  )
}
