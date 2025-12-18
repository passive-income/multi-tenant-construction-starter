'use client'

import { Card } from '@/components/ui/card'

export const ProjectGallery = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Keine Referenzen verfügbar</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, idx) => (
        <Card key={idx} className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-muted relative">
            {src ? (
              <img 
                src={src} 
                alt={`Projekt ${idx + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground text-sm">Bild nicht verfügbar</div>'
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Bild nicht verfügbar
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}