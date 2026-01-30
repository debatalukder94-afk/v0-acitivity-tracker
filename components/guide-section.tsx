"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, CheckCircle2, Circle, Target, Zap, ThumbsUp, TrendingUp, Clock, Users } from "lucide-react"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"
import { LoadingScreen } from "@/components/ui/activity-loader"

interface GuideSectionProps {
  username: string
}

export function GuideSection({ username }: GuideSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return <LoadingScreen message="Loading your guide..." />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px] md:min-h-[300px]">
        <p className="text-slate-500">User not found</p>
      </div>
    )
  }

  const followers = user.follower_count
  const following = user.following_count

  let percentile = 50
  if (followers >= 100000) percentile = 0.1
  else if (followers >= 50000) percentile = 0.5
  else if (followers >= 10000) percentile = 1
  else if (followers >= 5000) percentile = 5
  else if (followers >= 1000) percentile = 15
  else if (followers >= 500) percentile = 25
  else if (followers >= 100) percentile = 40
  else percentile = 60

  const nextFollowerMilestone = Math.ceil(followers / 1000) * 1000 + 1000
  const dailyCastGoal = 3
  const weeklyCastGoal = dailyCastGoal * 7
  const engagementGoal = 20 // Target 20 avg interactions per cast

  const socialTips = [
    {
      task: `Post ${dailyCastGoal}x daily (${engagementStats.weeklyPosts}/${weeklyCastGoal} this week)`,
      progress: Math.min(Math.round((engagementStats.weeklyPosts / weeklyCastGoal) * 100), 100),
      done: engagementStats.weeklyPosts >= weeklyCastGoal,
      icon: Clock,
    },
    {
      task: `Reach ${formatNumber(nextFollowerMilestone)} followers`,
      progress: Math.round((followers / nextFollowerMilestone) * 100),
      done: followers >= nextFollowerMilestone,
      icon: Users,
    },
    {
      task: `Get ${engagementGoal}+ avg engagement (now ${engagementStats.engagementRate})`,
      progress: Math.min(Math.round((engagementStats.engagementRate / engagementGoal) * 100), 100),
      done: engagementStats.engagementRate >= engagementGoal,
      icon: TrendingUp,
    },
    {
      task: `Get ${formatNumber(engagementStats.avgLikes + 10)} avg likes per cast`,
      progress: Math.min(Math.round((engagementStats.avgLikes / (engagementStats.avgLikes + 10)) * 100), 99),
      done: false,
      icon: Target,
    },
  ]

  const completedTasks = socialTips.filter((t) => t.done).length

  const growthTips = [
    {
      task: "Engage with trending topics",
      status: engagementStats.weeklyPosts >= 5 ? "done" : engagementStats.weeklyPosts >= 2 ? "active" : "pending",
      description: `${engagementStats.weeklyPosts} posts this week`,
    },
    {
      task: "Reply to popular casts",
      status: engagementStats.totalReplies >= 10 ? "done" : engagementStats.totalReplies >= 3 ? "active" : "pending",
      description: `${engagementStats.totalReplies} replies received`,
    },
    {
      task: "Share valuable insights",
      status: engagementStats.totalRecasts >= 20 ? "done" : engagementStats.totalRecasts >= 5 ? "active" : "pending",
      description: `${engagementStats.totalRecasts} recasts earned`,
    },
    {
      task: "Build consistent presence",
      status: following > 0 && followers / following >= 1 ? "done" : "active",
      description: `${formatNumber(followers)}/${formatNumber(following)} ratio`,
    },
  ]

  const completedGrowthTips = growthTips.filter((t) => t.status === "done").length

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <img
            src={user.pfp_url || "/placeholder.svg?height=48&width=48&query=avatar"}
            alt={user.display_name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-base md:text-xl font-bold text-slate-800">Activity Guide</h1>
          <p className="text-slate-500 text-xs md:text-sm">Personalized tips for @{user.username}</p>
        </div>
      </div>

      {/* Success banner - shows real percentile */}
      <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 border-0 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-2 md:gap-4">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md shrink-0">
            <ThumbsUp className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-bold">
              {engagementStats.engagementRate >= 5
                ? `Great job, ${user.display_name}!`
                : `Keep growing, ${user.display_name}!`}
            </h2>
            <p className="text-emerald-100 text-xs md:text-base">
              {"You're"} in the top {percentile}% with {formatNumber(followers)} followers
            </p>
          </div>
        </div>
      </Card>

      {/* Tips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-800">Your Goals</h3>
          </div>

          <div className="space-y-2 md:space-y-3">
            {socialTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2">
                {tip.done ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0">
                    <tip.icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-xs font-medium truncate ${tip.done ? "text-slate-400 line-through" : "text-slate-700"}`}
                    >
                      {tip.task}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-semibold ml-1">{tip.progress}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        tip.progress === 100
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : "bg-gradient-to-r from-sky-400 to-indigo-500"
                      }`}
                      style={{ width: `${tip.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
            <span className="text-[10px] md:text-xs text-slate-500 font-medium">
              {completedTasks}/{socialTips.length} goals achieved
            </span>
          </div>
        </Card>

        <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-800">Growth Progress</h3>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            {growthTips.map((tip, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-1.5 md:p-2 rounded-lg transition-all ${
                  tip.status === "active"
                    ? "bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100"
                    : "hover:bg-slate-50"
                }`}
              >
                {tip.status === "done" ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                ) : tip.status === "active" ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-violet-500 flex items-center justify-center shrink-0 bg-white">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-medium block ${tip.status === "done" ? "text-slate-400 line-through" : "text-slate-700"}`}
                  >
                    {tip.task}
                  </span>
                  <span className="text-[10px] text-slate-400">{tip.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-[10px] md:text-xs font-semibold">
              {growthTips.length - completedGrowthTips} in progress
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-[10px] md:text-xs font-semibold">
              {completedGrowthTips} done
            </span>
          </div>
        </Card>
      </div>

      {/* Quick stats from real data */}
      <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100/50">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-700">Quick Insights</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-white shadow-sm">
            <p className="text-lg md:text-xl font-bold text-slate-800">{engagementStats.avgLikes}</p>
            <p className="text-[10px] md:text-xs text-slate-500">Avg likes/cast</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white shadow-sm">
            <p className="text-lg md:text-xl font-bold text-slate-800">{engagementStats.weeklyPosts}</p>
            <p className="text-[10px] md:text-xs text-slate-500">Posts this week</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white shadow-sm">
            <p className="text-lg md:text-xl font-bold text-slate-800">{engagementStats.engagementRate}</p>
            <p className="text-[10px] md:text-xs text-slate-500">Avg engagement</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white shadow-sm">
            <p className="text-lg md:text-xl font-bold text-slate-800">
              {following > 0 ? (followers / following).toFixed(1) : followers}x
            </p>
            <p className="text-[10px] md:text-xs text-slate-500">Follow ratio</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
