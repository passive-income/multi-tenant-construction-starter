export function ImageSliderLoading() {
  // Match the actual image slider height - full viewport minus header
  const headerHeight = "4rem"; // 64px
  
  return (
    <div
      className="relative w-full bg-gradient-to-br from-muted/80 to-muted animate-pulse overflow-hidden"
      style={{
        height: `calc(100dvh - ${headerHeight})`,
        minHeight: `calc(100dvh - ${headerHeight})`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
        <div className="h-16 w-3/4 max-w-2xl bg-muted-foreground/20 rounded"></div>
        <div className="h-8 w-1/2 max-w-md bg-muted-foreground/20 rounded"></div>
        <div className="h-14 w-48 bg-muted-foreground/20 rounded-lg"></div>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
        ))}
      </div>
    </div>
  );
}
