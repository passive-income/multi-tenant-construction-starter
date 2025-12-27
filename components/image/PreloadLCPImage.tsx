import React from 'react'

export function PreloadLCPImage({ src }: { src: string }) {
  if (!src) return null

  return (
    <>
      <link rel="preload" as="image" href={src} fetchPriority="high" />
      {/* Provide a low-cost hint for browsers that support it */}
      <link rel="preconnect" href={new URL(src).origin} crossOrigin="" />
    </>
  )
}

export default PreloadLCPImage
