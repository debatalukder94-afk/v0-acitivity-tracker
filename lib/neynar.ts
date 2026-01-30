// Neynar API client for Farcaster data

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster"

export interface NeynarUser {
  object: string
  fid: number
  username: string
  display_name: string
  pfp_url: string
  custody_address: string
  profile: {
    bio: {
      text: string
    }
  }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
  power_badge: boolean
}

export interface NeynarCast {
  hash: string
  thread_hash: string
  parent_hash: string | null
  author: NeynarUser
  text: string
  timestamp: string
  reactions: {
    likes_count: number
    recasts_count: number
    likes: { fid: number; fname: string }[]
    recasts: { fid: number; fname: string }[]
  }
  replies: {
    count: number
  }
  embeds: { url: string }[]
}

export interface NeynarChannel {
  id: string
  name: string
  description: string
  image_url: string
  follower_count: number
}

// Helper to get API key from env
function getApiKey(): string {
  const apiKey = process.env.NEYNAR_API_KEY
  if (!apiKey) {
    throw new Error("NEYNAR_API_KEY environment variable is not set")
  }
  return apiKey
}

// Helper function to normalize username by removing common suffixes
function normalizeUsername(username: string): string {
  // Remove @ prefix if present
  let normalized = username.startsWith("@") ? username.slice(1) : username

  // Remove common suffixes (ordered from most specific to least)
  const suffixes = [".farcaster.eth", ".base.eth", ".cb.id", ".eth", ".fc", ".farcaster"]

  for (const suffix of suffixes) {
    if (normalized.toLowerCase().endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length)
      break
    }
  }

  return normalized.toLowerCase().trim()
}

// Fetch user by username
export async function fetchUserByUsername(username: string): Promise<NeynarUser | null> {
  const originalUsername = username
  const normalizedUsername = normalizeUsername(username)

  console.log("[v0] Looking up user:", { original: originalUsername, normalized: normalizedUsername })

  // Strategy 1: Try direct username lookup with normalized name
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/by_username?username=${normalizedUsername}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] Found user via direct lookup:", data.user?.username)
      return data.user
    }

    console.log("[v0] Direct lookup failed with status:", response.status)
  } catch (error) {
    console.error("[v0] Error in direct lookup:", error)
  }

  // Strategy 2: Try searching for the user
  console.log("[v0] Trying search fallback for:", normalizedUsername)
  try {
    const searchResults = await searchUsers(normalizedUsername, 5)
    console.log("[v0] Search returned", searchResults.length, "results")

    if (searchResults.length > 0) {
      // Find exact match first
      const exactMatch = searchResults.find((u) => u.username.toLowerCase() === normalizedUsername.toLowerCase())
      if (exactMatch) {
        console.log("[v0] Found exact match:", exactMatch.username)
        return exactMatch
      }

      // Otherwise return first result
      console.log("[v0] Returning first search result:", searchResults[0].username)
      return searchResults[0]
    }
  } catch (error) {
    console.error("[v0] Error in search fallback:", error)
  }

  // Strategy 3: Try with original username (without normalization) in case it's actually valid
  if (normalizedUsername !== originalUsername.replace("@", "").toLowerCase()) {
    console.log("[v0] Trying original username:", originalUsername)
    try {
      const cleanOriginal = originalUsername.replace("@", "").toLowerCase()
      const response = await fetch(`${NEYNAR_API_URL}/user/by_username?username=${cleanOriginal}`, {
        headers: {
          "x-api-key": getApiKey(),
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Found user via original username:", data.user?.username)
        return data.user
      }
    } catch (error) {
      console.error("[v0] Error with original username lookup:", error)
    }
  }

  console.log("[v0] User not found after all strategies")
  return null
}

// Fetch user by FID
export async function fetchUserByFid(fid: number): Promise<NeynarUser | null> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/bulk?fids=${fid}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.users?.[0] || null
  } catch (error) {
    console.error("Error fetching user by FID:", error)
    return null
  }
}

// Fetch user's casts (posts)
export async function fetchUserCasts(fid: number, limit = 25): Promise<NeynarCast[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/feed/user/casts?fid=${fid}&limit=${limit}&include_replies=false`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.casts || []
  } catch (error) {
    console.error("Error fetching casts:", error)
    return []
  }
}

// Search users
export async function searchUsers(query: string, limit = 10): Promise<NeynarUser[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.result?.users || []
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

// Fetch user's channels
export async function fetchUserChannels(fid: number): Promise<NeynarChannel[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/channels?fid=${fid}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.channels || []
  } catch (error) {
    console.error("Error fetching channels:", error)
    return []
  }
}

// Fetch trending casts
export async function fetchTrendingCasts(limit = 10): Promise<NeynarCast[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/feed/trending?limit=${limit}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.casts || []
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}

// Get a Neynar client instance with common methods
export function getNeynarClient() {
  return {
    fetchUserByUsername,
    fetchUserByFid,
    fetchUserCasts,
    searchUsers,
    fetchUserChannels,
    fetchTrendingCasts,
    async fetchBulkUsers(usernames: string[]): Promise<{ users: NeynarUser[] }> {
      const users: NeynarUser[] = []
      for (const username of usernames) {
        const user = await fetchUserByUsername(username)
        if (user) {
          users.push(user)
        }
      }
      return { users }
    },
  }
}
