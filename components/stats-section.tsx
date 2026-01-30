"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Award, Sparkles, Users, MessageCircle, Heart, Repeat2 } from "lucide-react"
import {
  useFarcasterUser,
  useFarcasterCasts,
  calculateEngagementStats,
  formatNumber,
  calculateFollowRatio,
} from "@/hooks/use-farcaster"
import { LoadingScreen } from "@/components/ui/activity-loader"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from "recharts"

interface StatsSectionProps {
  username: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700">
        <p className="font-semibold mb-1">Cast #{label}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" /> {data.likes} likes
          </p>
          <p className="flex items-center gap-1">
            <Repeat2 className="w-3 h-3 text-emerald-400" /> {data.recasts} recasts
          </p>
          <p className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-sky-400" /> {data.replies} replies
          </p>
        </div>
        <p className="mt-2 pt-2 border-t border-slate-600 font-bold">{data.total} total</p>
      </div>
    )
  }
  return null
}

export function StatsSection({ username }: StatsSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return <LoadingScreen message="Loading your stats..." />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <p className="text-slate-500">User not found</p>
      </div>
    )
  }

  const chartData = casts.slice(0, 12).map((cast, index) => ({
    name: `#${index + 1}`,
    likes: cast.reactions.likes_count,
    recasts: cast.reactions.recasts_count,
    replies: cast.replies.count,
    total: cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count,
    text: cast.text.slice(0, 50),
  }))

  const maxEngagement = Math.max(...chartData.map((d) => d.total), 1)
  const followRatioData = calculateFollowRatio(user.follower_count, user.following_count)

  const trendData = casts
    .slice(0, 20)
    .reverse()
    .map((cast, index) => ({
      name: `${index + 1}`,
      engagement: cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count,
      likes: cast.reactions.likes_count,
    }))

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <img
              src={user.pfp_url || "/placeholder.svg?height=56&width=56&query=avatar"}
              alt={user.display_name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full ring-4 ring-white shadow-xl"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Your Stats</h1>
            <p className="text-slate-500 text-sm">
              @{user.username} • FID #{user.fid}
            </p>
          </div>
        </div>
        {user.power_badge && (
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-lg w-fit sm:ml-auto">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            Power User
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            label: "Followers",
            value: formatNumber(user.follower_count),
            change: `Following ${formatNumber(user.following_count)}`,
            icon: Users,
            color: "from-orange-400 to-rose-500",
            shadow: "shadow-orange-200/50",
          },
          {
            label: "Avg Engagement",
            value: engagementStats.engagementRate.toString(),
            change: "per cast",
            icon: TrendingUp,
            color: "from-sky-400 to-indigo-500",
            shadow: "shadow-sky-200/50",
          },
          {
            label: "Total Engagement",
            value: formatNumber(engagementStats.totalEngagement),
            change: `from ${casts.length} casts`,
            icon: Target,
            color: "from-emerald-400 to-teal-500",
            shadow: "shadow-emerald-200/50",
          },
        ].map((metric) => (
          <Card
            key={metric.label}
            className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden group card-3d"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3 md:mb-5 shadow-xl ${metric.shadow}`}
              >
                <metric.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-slate-500 mb-1 md:mb-2 font-medium">{metric.label}</p>
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-4xl font-bold text-slate-800">{metric.value}</span>
                <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 text-xs md:text-sm font-semibold">
                  {metric.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <div className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
              <span className="text-orange-600 font-semibold flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                Your Growth
              </span>
            </div>
          </div>

          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center mb-3 text-balance">
            <span className="text-slate-800">Reached </span>
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {formatNumber(user.follower_count)}
            </span>
            <br />
            <span className="text-slate-800">followers </span>
            <span className="text-slate-400">on Farcaster</span>
          </h2>

          <div className="mt-6 md:mt-10 bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold text-slate-700">Recent Cast Performance</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Last {chartData.length} casts</span>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg">
                  <span className="text-white font-bold text-sm md:text-lg">{followRatioData.ratio.toFixed(1)}x</span>
                  <p className="text-orange-100 text-xs font-medium hidden sm:block">{followRatioData.label}</p>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-48 md:h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.total === maxEngagement ? "url(#barGradientMax)" : "url(#barGradient)"}
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fed7aa" />
                        <stop offset="100%" stopColor="#ffedd5" />
                      </linearGradient>
                      <linearGradient id="barGradientMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No cast data available</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Engagement Trend</h3>
                <p className="text-xs text-slate-400">Your engagement over recent casts</p>
              </div>
            </div>
          </div>

          <div className="h-40 md:h-56 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} engagement`, "Total"]}
                    labelFormatter={(label) => `Cast #${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#engagementGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No trend data available</div>
            )}
          </div>
        </div>
      </Card>

      {/* Engagement breakdown with real data */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative">
          <div className="flex justify-center mb-4 md:mb-8">
            <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-slate-100 to-indigo-50 text-slate-600 font-semibold border border-slate-200/50 text-sm md:text-base">
              Engagement Breakdown
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalLikes)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Likes</p>
              <p className="text-xs text-slate-400">avg {engagementStats.avgLikes}/cast</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Repeat2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalRecasts)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Recasts</p>
              <p className="text-xs text-slate-400">avg {engagementStats.avgRecasts}/cast</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalReplies)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Replies</p>
              <p className="text-xs text-slate-400">avg {engagementStats.avgReplies}/cast</p>
            </div>
          </div>

          <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2 text-center">
            {engagementStats.engagementRate} avg engagement per cast
          </h3>
          <p className="text-slate-500 text-center text-sm md:text-base">Based on your last {casts.length} casts</p>
        </div>
      </Card>

      {/* Goals with dynamic targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[
          {
            label: "Follower Goal",
            current: user.follower_count,
            target: Math.ceil(user.follower_count / 1000) * 1000 + 1000,
            color: "sky",
          },
          {
            label: "Weekly Casts Goal",
            current: engagementStats.weeklyPosts,
            target: 21,
            unit: " casts",
            color: "emerald",
          },
        ].map((goal) => (
          <Card
            key={goal.label}
            className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-bold text-slate-800 text-base md:text-lg">{goal.label}</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
                <svg className="w-20 h-20 md:w-28 md:h-28 -rotate-90 drop-shadow-lg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="8" className="md:hidden" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={`url(#gradient-${goal.label})`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((goal.current / goal.target) * 213.6, 213.6)} 213.6`}
                    className="md:hidden drop-shadow-md"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    className="hidden md:block"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke={`url(#gradient-${goal.label})`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((goal.current / goal.target) * 301.6, 301.6)} 301.6`}
                    className="hidden md:block drop-shadow-md"
                  />
                  <defs>
                    <linearGradient id={`gradient-${goal.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={goal.color === "sky" ? "#0ea5e9" : "#10b981"} />
                      <stop offset="100%" stopColor={goal.color === "sky" ? "#6366f1" : "#14b8a6"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold text-slate-800">
                    {Math.min(Math.round((goal.current / goal.target) * 100), 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-slate-800">
                  {goal.unit ? goal.current : formatNumber(goal.current)}
                  {goal.unit || ""}
                </p>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  of {goal.unit ? goal.target : formatNumber(goal.target)}
                  {goal.unit || ""} target
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  {goal.target - goal.current > 0
                    ? `${goal.unit ? goal.target - goal.current : formatNumber(goal.target - goal.current)} to go!`
                    : "Goal reached!"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
