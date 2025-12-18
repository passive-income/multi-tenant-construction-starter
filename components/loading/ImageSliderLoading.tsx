export function ImageSliderLoading() {
  // Header height is h-16 (4rem = 64px)
  const headerHeight = '4rem'
  
  return (
    <div 
      className="relative w-full bg-muted animate-pulse"
      style={{ 
        height: `calc(100vh - ${headerHeight})`,
        minHeight: `calc(100vh - ${headerHeight})`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-muted-foreground text-lg md:text-xl">Lade Bilder...</div>
      </div>
    </div>
  )
}

