"use client"

import { Card } from "@/components/ui/card"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"
import type { NeynarUser } from "@/lib/neynar"
import { useRef } from "react"
import html2canvas from "html2canvas"
import { Share2, Download } from "lucide-react"
import { useState } from "react"

interface ShareActivitySectionProps {
  username: string
}

export function ShareActivitySection({ username }: ShareActivitySectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return (
      <Card className="p-8 rounded-2xl bg-white border border-slate-200">
        <div className="text-center py-8">
          <p className="text-slate-500">Loading your activity...</p>
        </div>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  const avgEngagement = Math.round(engagementStats.engagementRate)

  const handleDownloadCardImage = async () => {
    setIsDownloading(true)
    try {
      const cardImageUrl = `/api/generate-card?username=${encodeURIComponent(user.username)}&score=${avgEngagement}&displayName=${encodeURIComponent(user.display_name)}&pfpUrl=${encodeURIComponent(user.pfp_url || '')}`
      
      const response = await fetch(cardImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `activity-card-${user.username}-${Date.now()}.png`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to download card image:", error)
    } finally {
      setIsDownloading(false)
    }
  }

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

  const handleShareToFarcaster = async () => {
    const profileUrl = `https://activity-tracker.online/profile/${user.username}`
    const cardImageUrl = `https://activity-tracker.online/api/generate-card?username=${encodeURIComponent(user.username)}&score=${avgEngagement}&displayName=${encodeURIComponent(user.display_name)}&pfpUrl=${encodeURIComponent(user.pfp_url || '')}`
    
    const text = `📊 Just checked my Farcaster engagement on Activity Tracker!

My engagement score: ${avgEngagement}
Username: @${user.username}

Are you staying based? Check YOUR engagement stats 👇

Track your activity. Know your impact. Stay Based. 🟣
Built on /base.`

    // Detect if running in Base App
    const isInBaseApp = typeof window !== 'undefined' && (
      window.location.hostname.includes('baseapp') || 
      window.navigator.userAgent.includes('BaseApp') ||
      (window as any).baseApp !== undefined
    )

    if (isInBaseApp) {
      // Try to use Base App native share
      if ((window as any).baseApp && (window as any).baseApp.share) {
        try {
          (window as any).baseApp.share({ 
            text: text,
            imageUrl: cardImageUrl
          })
          return
        } catch (error) {
          console.error('[v0] Base App share error:', error)
        }
      }

      // Fallback: Copy to clipboard for Base App
      try {
        const shareMessage = `${text}\n\n${cardImageUrl}`
        await navigator.clipboard.writeText(shareMessage)
        alert('Activity card copied to clipboard! Paste in your Base App cast.')
      } catch (error) {
        console.error('[v0] Clipboard copy failed:', error)
      }
    } else {
      // Regular web: open Farcaster compose
      const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(cardImageUrl)}&embeds[]=${encodeURIComponent(profileUrl)}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      {/* CTA Card */}
      <Card className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-indigo-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Share Your Activity</h3>
            <p className="text-slate-600">Generate a shareable card showing your Farcaster engagement and post it to Base App</p>
          </div>
        </div>
      </Card>

      {/* Shareable Activity Card */}
      <Card className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden">
        <div className="flex flex-col items-center gap-8">
          {/* Card Preview Container */}
          <div className="w-full max-w-sm">
            <div
              ref={cardRef}
              onClick={() => {
                const profileUrl = `https://activity-tracker.online/profile/${user.username}`
                window.open(profileUrl, "_blank")
              }}
              className="relative w-full bg-gradient-to-b from-[#C4B5FD] via-[#E9D5FF] to-white rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 active:scale-98"
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
                    <p className="text-xs text-slate-600 font-medium mb-1">Avg Engagement Score</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                      {avgEngagement}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Based on last 30 days</p>
                  </div>
                </div>

                {/* MIDDLE SECTION - Daily Activity Stats */}
                <div className="backdrop-blur-md bg-[#EFF6FF]/80 rounded-2xl p-4 border border-white/60 shadow-lg">
                  <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Activity Summary</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Likes */}
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-600 mb-1">Likes</p>
                      <p className="text-xl font-bold text-slate-800">{formatNumber(engagementStats.totalLikes)}</p>
                    </div>

                    {/* Recasts */}
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-600 mb-1">Recasts</p>
                      <p className="text-xl font-bold text-slate-800">{formatNumber(engagementStats.totalRecasts)}</p>
                    </div>

                    {/* Replies */}
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-600 mb-1">Replies</p>
                      <p className="text-xl font-bold text-slate-800">{formatNumber(engagementStats.totalReplies)}</p>
                    </div>
                  </div>
                </div>

                {/* FOOTER - CTA Text */}
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800 bg-slate-100/60 py-2.5 rounded-xl">
                    Check your score
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            <button
              onClick={handleShareToFarcaster}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-5 h-5" />
              Share to Farcaster
            </button>
            <button
              onClick={handleDownloadCardImage}
              disabled={isDownloading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? "Generating..." : "Download Card Image"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
