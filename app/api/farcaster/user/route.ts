import { type NextRequest, NextResponse } from "next/server"
import { fetchUserByUsername, fetchUserByFid } from "@/lib/neynar"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")
  const fid = searchParams.get("fid")

  console.log("[v0] User API called with:", { username, fid })

  if (!username && !fid) {
    return NextResponse.json({ error: "Username or FID is required" }, { status: 400 })
  }

  try {
    let user
    if (username) {
      user = await fetchUserByUsername(username)
    } else if (fid) {
      user = await fetchUserByFid(Number.parseInt(fid, 10))
    }

    if (!user) {
      console.log("[v0] No user found for:", username || fid)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("[v0] Returning user:", user.username, "fid:", user.fid)
    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
