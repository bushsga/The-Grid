import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFD700',
          borderRadius: '36px', // Rounded corners like iOS
          fontWeight: 'bold',
        }}
      >
        {/* You can use text or symbol */}
        <span style={{ transform: 'rotate(15deg)' }}>⚡</span>
      </div>
    ),
    {
      ...size,
    }
  )
}