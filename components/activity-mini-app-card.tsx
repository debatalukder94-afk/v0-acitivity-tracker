"use client"

import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"
import { Heart, Repeat2, MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"

interface ActivityMiniAppCardProps {
  username: string
}

export function ActivityMiniAppCard({ username }: ActivityMiniAppCardProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)
  const [isSharing, setIsSharing] = useState(false)

  if (userLoading || castsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">Loading activity stats...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">User not found</p>
      </div>
    )
  }

  const avgEngagement = Math.round(engagementStats.engagementRate)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const text = `📊 Just checked my Farcaster engagement on Activity Tracker!

My engagement score: ${avgEngagement}
Username: @${user.username}

Are you staying based? Check YOUR engagement stats 👇

Track your activity. Know your impact. Stay Based. 🟣
Built on /base.`

      const isInBaseApp = typeof window !== 'undefined' && (
        window.location.hostname.includes('baseapp') || 
        window.navigator.userAgent.includes('BaseApp') ||
        (window as any).baseApp !== undefined
      )

      if (isInBaseApp) {
        if ((window as any).baseApp && (window as any).baseApp.share) {
          (window as any).baseApp.share({ text })
        } else {
          await navigator.clipboard.writeText(text)
          alert('Activity copied! Paste in your Base App cast.')
        }
      } else {
        const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
        window.open(url, "_blank")
      }
    } catch (error) {
      console.error('[v0] Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      {/* Orange Border Frame */}
      <div className="relative w-full max-w-sm">
        {/* Outer Orange Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl" style={{ padding: "8px" }}>
          {/* Inner Purple Gradient Card */}
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl overflow-hidden">
            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-6">
              {/* User Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                {user.pfp_url && (
                  <img
                    src={user.pfp_url || "/placeholder.svg"}
                    alt={user.username}
                    className="relative w-20 h-20 rounded-full border-4 border-white object-cover"
                  />
                )}
              </div>

              {/* Display Name */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">{user.display_name}</h2>
                <p className="text-white/90 text-sm">@{user.username}</p>
              </div>

              {/* Engagement Score Section */}
              <div className="text-center">
                <p className="text-white/80 text-sm font-medium mb-2">Avg Engagement Score</p>
                <p className="text-5xl font-bold text-white">{avgEngagement.toFixed(2)}</p>
              </div>

              {/* CTA Button Area */}
              <div className="w-full">
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  {isSharing ? "Sharing..." : "Share Your Activity"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons Footer */}
        <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
          <MessageCircle className="w-6 h-6" />
          <Repeat2 className="w-6 h-6" />
          <Heart className="w-6 h-6" />
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0M9 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
            </svg>
          </div>
        </div>
      </div>

      {/* Activity Summary Card (Below) */}
      <div className="absolute bottom-8 left-4 right-4 max-w-sm mx-auto bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Just checked my Activity Stats!</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">📊 {user.display_name}</span>
            <span className="text-slate-600">(@{user.username})</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span className="text-slate-800">🎯 Avg Engagement:</span>
            <span className="text-violet-600">{avgEngagement}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">❤️ Likes</span>
            <span className="font-semibold text-slate-800">{formatNumber(engagementStats.totalLikes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">🔄 Recasts</span>
            <span className="font-semibold text-slate-800">{formatNumber(engagementStats.totalRecasts)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">💬 Replies</span>
            <span className="font-semibold text-slate-800">{formatNumber(engagementStats.totalReplies)}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600 text-center">
            Check your own stats on <span className="font-semibold">Activity Tracker</span>!
          </p>
        </div>
      </div>
    </div>
  )
}
