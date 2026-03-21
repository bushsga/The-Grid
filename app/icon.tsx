import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFD700', // Gold color for solar
          fontWeight: 'bold',
        }}
      >
        {/* You can customize this - maybe "G" for Grid, or a sun symbol */}
        ⚡
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported size
      ...size,
    }
  )
}