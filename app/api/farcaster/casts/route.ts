import { type NextRequest, NextResponse } from "next/server"
import { fetchUserCasts } from "@/lib/neynar"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fid = searchParams.get("fid")
  const limit = searchParams.get("limit") || "25"

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 })
  }

  try {
    const casts = await fetchUserCasts(Number.parseInt(fid, 10), Number.parseInt(limit, 10))
    return NextResponse.json({ casts })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch casts" }, { status: 500 })
  }
}
