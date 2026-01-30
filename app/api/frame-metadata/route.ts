import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username') || 'deba9t6'
    const score = searchParams.get('score') || '12'

    const cardImageUrl = `https://activity-tracker.online/api/generate-card?username=${username}&score=${score}`
    const profileUrl = `https://activity-tracker.online/profile/${username}`

    const metadata = {
      title: `${username}'s Activity Card`,
      description: `Check ${username}'s Farcaster engagement score: ${score}`,
      og: {
        title: `${username}'s Activity Card`,
        description: 'Just checked my Farcaster engagement on Activity Tracker!',
        image: cardImageUrl,
      },
      fc: {
        frame: {
          version: '1.0',
          imageUrl: cardImageUrl,
          buttons: [
            {
              label: 'View Full Stats',
              action: 'post',
              target: `${profileUrl}?action=view`,
            },
          ],
        },
      },
    }

    return Response.json(metadata)
  } catch (error) {
    console.error('[v0] Error generating frame metadata:', error)
    return Response.json({ error: 'Failed to generate metadata' }, { status: 500 })
  }
}
