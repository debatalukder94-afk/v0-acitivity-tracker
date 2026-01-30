import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'deba9t6'
    const score = searchParams.get('score') || '12'
    const displayName = searchParams.get('displayName') || 'User'
    const pfpUrl = searchParams.get('pfpUrl') || 'https://i.pravatar.cc/150?u=default&d=identicon'

    const usernameDisplay = username.startsWith('@') ? username : `@${username}`

    return new ImageResponse(
      (<div style={{ display: 'flex', flexDirection: 'column', width: '500px', height: '650px', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', padding: '12px', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, #a78bfa 0%, #d8b4fe 50%, #f472b6 100%)', borderRadius: '24px', padding: '40px 20px', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', borderRadius: '50%', background: 'white', border: '4px solid white', overflow: 'hidden' }}>
            <img src={pfpUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0' }}>{displayName}</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: '0' }}>{usernameDisplay}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>Avg Engagement Score</p>
            <p style={{ fontSize: '72px', fontWeight: '900', color: 'white', margin: '0', lineHeight: '1' }}>{score}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: '#334155', borderRadius: '16px', padding: '16px', marginTop: '12px', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>check your score</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '12px', fontSize: '24px' }}>
          <span>💬</span>
          <span>🔄</span>
          <span>❤️</span>
          <span>↗️</span>
        </div>
      </div>),
      {
        width: 500,
        height: 650,
      },
    )
  } catch (error) {
    console.error('[v0] Error generating card image:', error)
    return new Response('Error generating card', { status: 500 })
  }
}
