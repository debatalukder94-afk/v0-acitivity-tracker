import { type NextRequest, NextResponse } from "next/server"
import { searchUsers } from "@/lib/neynar"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const limit = searchParams.get("limit") || "10"

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    const users = await searchUsers(query, Number.parseInt(limit, 10))
    return NextResponse.json({ users })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
