"use client"

import { TrendingUp, Users, Heart, MessageCircle, PieChart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"
import { LoadingScreen } from "@/components/ui/activity-loader"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { CardSection } from "@/components/activity-card-generator/card-section"

interface GrowthSectionProps {
  username: string
}

export function GrowthSection({ username }: GrowthSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return <LoadingScreen message="Loading growth analytics..." />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <p className="text-slate-500">User not found</p>
        </div>
      </div>
    )
  }

  // Generate growth trend data
  const growthTrendData = Array.from({ length: 8 }, (_, i) => ({
    name: `Week ${i + 1}`,
    followers: Math.max(100, user.follower_count - (8 - i) * 50),
    engagement: Math.max(10, engagementStats.engagementRate - (8 - i) * 2),
  }))

  // Engagement breakdown for pie chart
  const engagementBreakdown = [
    { name: "Likes", value: engagementStats.totalLikes, color: "#ef4444" },
    { name: "Recasts", value: engagementStats.totalRecasts, color: "#10b981" },
    { name: "Replies", value: engagementStats.totalReplies, color: "#3b82f6" },
  ]

  // Growth metrics cards
  const growthMetrics = [
    {
      title: "Total Followers",
      value: formatNumber(user.follower_count),
      change: "+12%",
      icon: Users,
      gradient: "from-sky-400 to-blue-500",
      bgGradient: "from-sky-50 to-blue-50",
    },
    {
      title: "Total Engagement",
      value: formatNumber(engagementStats.totalEngagement),
      change: "+8%",
      icon: Heart,
      gradient: "from-rose-400 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
    },
    {
      title: "Avg Per Cast",
      value: engagementStats.engagementRate.toFixed(1),
      change: "interactions",
      icon: TrendingUp,
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "Weekly Posts",
      value: engagementStats.weeklyPosts.toString(),
      change: `${engagementStats.weeklyPosts === 0 ? "Start posting!" : "casts"}`,
      icon: MessageCircle,
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Your Growth</h1>
          <p className="text-slate-500 text-sm mt-1">Track your Farcaster account performance</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Last updated</p>
          <p className="text-sm font-semibold text-slate-700">Today</p>
        </div>
      </div>

      {/* Main metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {growthMetrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <Card
              key={i}
              className={`p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br ${metric.bgGradient} border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d relative overflow-hidden group hover:shadow-xl`}
            >
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-40 blur-2xl group-hover:opacity-60 transition-opacity"
                style={{ backgroundImage: `linear-gradient(135deg, var(--metric-color-1), var(--metric-color-2))` }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur text-xs font-semibold text-emerald-600">
                    {metric.change}
                  </div>
                </div>

                <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-2">{metric.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-slate-800">{metric.value}</span>
                </div>

                {/* Mini bar chart indicator */}
                <div className="mt-4 flex items-end gap-1 h-8">
                  {[0.6, 0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 1].map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t bg-gradient-to-t ${metric.gradient} opacity-60 transition-all duration-300`}
                      style={{ height: `${val * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Growth trend and engagement breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Followers growth trend */}
        <Card className="lg:col-span-2 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-indigo-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">Followers Growth Trend</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-1">8 week progression</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value) => formatNumber(value as number)}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement breakdown pie chart */}
        <Card className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-rose-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">Engagement</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Breakdown</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
              <PieChart className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {engagementStats.totalEngagement > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={engagementBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {engagementBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <p className="text-slate-500 text-sm">No engagement data</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
            {engagementBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Card Generator */}
      <CardSection username={username} />

      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-purple-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-slate-700 font-semibold text-sm md:text-base">Best Performing</h3>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {engagementStats.bestCast ? engagementStats.bestCast.reactions.likes_count : 0}
          </p>
          <p className="text-xs md:text-sm text-slate-500">
            {engagementStats.bestCast ? engagementStats.bestCast.text.substring(0, 50) + "..." : "No casts yet"}
          </p>
        </Card>

        <Card className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-slate-700 font-semibold text-sm md:text-base">Engagement Rate</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {(engagementStats.engagementRate * 2).toFixed(0)}%
          </p>
          <p className="text-xs md:text-sm text-slate-500">Based on recent activity</p>
        </Card>

        <Card className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-slate-700 font-semibold text-sm md:text-base">Followers Ratio</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {(user.follower_count / (user.following_count || 1)).toFixed(1)}x
          </p>
          <p className="text-xs md:text-sm text-slate-500">Followers to following</p>
        </Card>
      </div>
    </div>
  )
}
