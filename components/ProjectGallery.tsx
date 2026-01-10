'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

export const ProjectGallery = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Keine Referenzen verfügbar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((rawSrc, idx) => {
        const src = typeof rawSrc === 'string' ? rawSrc.trim() : '';
        const validSrc = src.length > 0 ? src : null;
        return (
          <Card
            key={validSrc || `empty-${idx}`}
            className="overflow-hidden p-0 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-muted relative">
              {validSrc ? (
                <Image
                  src={validSrc}
                  alt={`Projekt ${idx + 1}`}
                  fill
                  sizes="(max-width:640px) 100vw, 50vw"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Bild nicht verfügbar
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
