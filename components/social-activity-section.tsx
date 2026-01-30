"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Heart, MessageCircle, TrendingUp, Users, Repeat2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ActivityCard } from "@/components/activity-card"
import { StatBadge } from "@/components/stat-badge"
import { ShareActivitySection } from "@/components/share-activity-section"
import {
  useFarcasterUser,
  useFarcasterCasts,
  calculateEngagementStats,
  formatRelativeTime,
  formatNumber,
} from "@/hooks/use-farcaster"
import { LoadingScreen } from "@/components/ui/activity-loader"

interface SocialActivitySectionProps {
  username: string
}

export function SocialActivitySection({ username }: SocialActivitySectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)
  const [showShareCard, setShowShareCard] = useState(false)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return <LoadingScreen message="Loading Farcaster data..." />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">User Not Found</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Could not find Farcaster user <span className="font-semibold text-slate-700">@{username}</span>
            </p>
            <p className="text-xs md:text-sm text-slate-400 mt-3">
              Try searching for a different user like <span className="font-mono text-sky-500">dwr.eth</span> or{" "}
              <span className="font-mono text-sky-500">v</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative group">
            <img
              src={user.pfp_url || "/placeholder.svg?height=56&width=56&query=avatar"}
              alt={user.display_name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">{user.display_name}</h1>
              {user.power_badge && (
                <div className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Power
                </div>
              )}
            </div>
            <p className="text-slate-500 text-sm">
              @{user.username} • FID #{user.fid}
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatBadge
          label="Followers"
          value={formatNumber(user.follower_count)}
          change={`#${user.fid}`}
          positive
          icon={<Users className="w-4 h-4" />}
        />
        <StatBadge label="Following" value={formatNumber(user.following_count)} icon={<Users className="w-4 h-4" />} />
        <StatBadge
          label="Total Likes"
          value={formatNumber(engagementStats.totalLikes)}
          change={`avg ${engagementStats.avgLikes}/cast`}
          positive
          icon={<Heart className="w-4 h-4" />}
        />
        <StatBadge
          label="This Week"
          value={engagementStats.weeklyPosts.toString()}
          change={engagementStats.weeklyPosts === 0 ? "Start posting!" : "casts"}
          icon={<MessageCircle className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Engagement overview card */}
        <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-rose-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Engagement Overview</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6">Real-time insights from your recent casts</p>

            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100/50">
              <div className="flex items-baseline justify-between mb-3 md:mb-4">
                <span className="text-xs md:text-sm text-slate-500">Engagement</span>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Avg per cast</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-4xl font-bold text-slate-800">{engagementStats.avgLikes}</span>
                    <span className="text-slate-400 text-xs md:text-sm">likes</span>
                  </div>
                </div>
              </div>

              <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-2">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500 rounded-full relative transition-all duration-1000"
                  style={{ width: `${Math.min(engagementStats.engagementRate * 2, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
              </div>
              <p className="text-xs md:text-sm text-emerald-600 font-medium">
                {engagementStats.engagementRate} avg engagement per cast
              </p>

              <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-5 pt-4 md:pt-5 border-t border-slate-100">
                {[
                  { value: formatNumber(engagementStats.totalLikes), label: "Likes", icon: Heart },
                  { value: formatNumber(engagementStats.totalRecasts), label: "Recasts", icon: Repeat2 },
                  { value: formatNumber(engagementStats.totalReplies), label: "Replies", icon: MessageCircle },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-base md:text-xl font-bold text-slate-700">{stat.value}</div>
                    <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                      <stat.icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Bio card */}
        <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-sky-200/30 to-indigo-200/20 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Profile Bio</h3>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100/50">
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {user.profile?.bio?.text || "No bio set"}
              </p>

              {user.verified_addresses?.eth_addresses?.length > 0 && (
                <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-700 mb-2 md:mb-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified Addresses
                  </h4>
                  <div className="space-y-2">
                    {user.verified_addresses.eth_addresses.slice(0, 2).map((addr, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono truncate">
                          {addr.slice(0, 6)}...{addr.slice(-4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Cast activity card */}
        <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-orange-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-orange-200/30 to-rose-200/20 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Cast Activity</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6">Your recent posting frequency</p>

            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100/50">
              <div className="flex gap-4 md:gap-6 mb-4 md:mb-5">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Total Casts</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-slate-800">{casts.length}</span>
                    <span className="text-xs md:text-sm text-slate-400">loaded</span>
                  </div>
                </div>
                <div className="pl-4 md:pl-6 border-l border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">This week</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-slate-800">{engagementStats.weeklyPosts}</span>
                    <span className="text-xs md:text-sm text-slate-400">casts</span>
                  </div>
                </div>
              </div>

              {casts[0] && (
                <div className="pt-3 md:pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Latest cast
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">{casts[0].text}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(casts[0].timestamp)}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent casts */}
      <div className="mt-6 md:mt-10">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Recent Casts</h2>
          <span className="text-xs md:text-sm text-slate-400">{casts.length} casts loaded</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {casts.slice(0, 8).map((cast, i) => (
            <div
              key={cast.hash}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ActivityCard
                content={cast.text}
                likes={cast.reactions.likes_count}
                comments={cast.replies.count}
                recasts={cast.reactions.recasts_count}
                time={formatRelativeTime(cast.timestamp)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Share Activity Section */}
      <ShareActivitySection username={username} />
    </div>
  )
}
