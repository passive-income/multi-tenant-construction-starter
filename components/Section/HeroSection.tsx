'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  linkText?: string
  linkHref?: string
  imageUrl?: string
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  linkText,
  linkHref,
  imageUrl,
  className = '',
}: HeroSectionProps) {
  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardContent className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
            {linkText && linkHref && (
              <Button asChild>
                <Link href={linkHref}>{linkText}</Link>
              </Button>
            )}
          </div>
          {imageUrl && (
            <div className="relative h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

