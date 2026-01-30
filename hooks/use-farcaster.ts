import useSWR from "swr"
import type { NeynarUser, NeynarCast } from "@/lib/neynar"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useFarcasterUser(username: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ user: NeynarUser }>(
    username ? `/api/farcaster/user?username=${username}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  )

  return {
    user: data?.user,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useFarcasterCasts(fid: number | null, limit = 25) {
  const { data, error, isLoading, mutate } = useSWR<{ casts: NeynarCast[] }>(
    fid ? `/api/farcaster/casts?fid=${fid}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  )

  return {
    casts: data?.casts || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useFarcasterSearch(query: string) {
  const { data, error, isLoading } = useSWR<{ users: NeynarUser[] }>(
    query.length >= 2 ? `/api/farcaster/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  )

  return {
    users: data?.users || [],
    isLoading,
    isError: error,
  }
}

export function calculateEngagementStats(casts: NeynarCast[]) {
  if (!casts.length) {
    return {
      totalLikes: 0,
      totalRecasts: 0,
      totalReplies: 0,
      avgLikes: 0,
      avgRecasts: 0,
      avgReplies: 0,
      engagementRate: 0,
      weeklyPosts: 0,
      totalEngagement: 0,
      bestCast: null as NeynarCast | null,
      worstCast: null as NeynarCast | null,
    }
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const totalLikes = casts.reduce((sum, cast) => sum + cast.reactions.likes_count, 0)
  const totalRecasts = casts.reduce((sum, cast) => sum + cast.reactions.recasts_count, 0)
  const totalReplies = casts.reduce((sum, cast) => sum + cast.replies.count, 0)
  const totalEngagement = totalLikes + totalRecasts + totalReplies
  const weeklyPosts = casts.filter((cast) => new Date(cast.timestamp) >= weekAgo).length

  // Find best and worst performing casts
  const castsWithEngagement = casts.map((cast) => ({
    cast,
    engagement: cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count,
  }))
  const sorted = [...castsWithEngagement].sort((a, b) => b.engagement - a.engagement)
  const bestCast = sorted[0]?.cast || null
  const worstCast = sorted[sorted.length - 1]?.cast || null

  // Calculate engagement rate: (total engagement / number of casts) as a simple average
  // Then express as a readable number (not divided by 100 again)
  const avgEngagementPerPost = totalEngagement / casts.length
  // Engagement rate = average engagement per post (as a simple metric)
  const engagementRate = Number(avgEngagementPerPost.toFixed(1))

  return {
    totalLikes,
    totalRecasts,
    totalReplies,
    avgLikes: Math.round(totalLikes / casts.length),
    avgRecasts: Math.round(totalRecasts / casts.length),
    avgReplies: Math.round(totalReplies / casts.length),
    engagementRate, // Now shows avg engagement per post (e.g., 15.3 means 15.3 interactions per cast)
    weeklyPosts,
    totalEngagement,
    bestCast,
    worstCast,
  }
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function calculateFollowRatio(followers: number, following: number): { ratio: number; label: string } {
  if (following === 0) {
    return { ratio: followers, label: `${formatNumber(followers)} followers` }
  }

  const ratio = followers / following

  if (ratio >= 10) {
    return { ratio, label: "Influencer" }
  } else if (ratio >= 2) {
    return { ratio, label: "Creator" }
  } else if (ratio >= 1) {
    return { ratio, label: "Balanced" }
  } else {
    return { ratio, label: "Networker" }
  }
}
