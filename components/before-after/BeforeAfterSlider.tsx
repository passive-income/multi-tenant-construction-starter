"use client"

import { useCallback, useRef, useState, useEffect } from 'react'
import { useIsMobile } from '@/lib/hooks/useIsMobile'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
  minHeight?: number
  /** Multiplier for overlay label size (1 = default). */
  labelScale?: number
}

// A simple before/after slider with a draggable handle. No external deps.
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Vorher',
  afterLabel = 'Nachher',
  className = '',
  minHeight = 360,
  labelScale = 1,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50) // percent
  const [isDragging, setIsDragging] = useState(false)
  const [isHoveringImages, setIsHoveringImages] = useState(false)
  const [isOnButton, setIsOnButton] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  const [responsiveScale, setResponsiveScale] = useState(1)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 768) setResponsiveScale(0.8)
      else if (w < 1024) setResponsiveScale(0.7)
      else setResponsiveScale(1)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const overlayVisibleBefore = isMobile
    ? (!isDragging && !isOnButton)
    : (isHoveringImages && !isOnButton && !isDragging)
  const overlayVisibleAfter = overlayVisibleBefore

  const clamp = (v: number) => Math.min(100, Math.max(0, v))

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(clamp(next))
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    updateFromClientX(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return
    e.preventDefault()
    e.stopPropagation()
    updateFromClientX(e.clientX)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
    setIsDragging(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setPosition((p) => clamp(p - 2))
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setPosition((p) => clamp(p + 2))
    }
    if (e.key === 'Home') {
      e.preventDefault()
      setPosition(0)
    }
    if (e.key === 'End') {
      e.preventDefault()
      setPosition(100)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl shadow-lg bg-muted ${className}`}
      style={{ minHeight, touchAction: 'none' }}
      onMouseEnter={() => setIsHoveringImages(true)}
      onMouseLeave={() => setIsHoveringImages(false)}
    >
      {/* After layer (full) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Before layer (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      
        {/* Overlays (before/after) rendered via mapping to reduce duplication */}
        {[
          {
            key: 'before',
            style: { width: `${position}%` } as React.CSSProperties,
            label: beforeLabel,
            rotated: position < 20,
          },
          {
            key: 'after',
            style: { left: `${position}%` } as React.CSSProperties,
            label: afterLabel,
            rotated: position > 80,
          },
        ].map((side) => {
          const visibleClass = isMobile
            ? (!isDragging ? 'opacity-100' : 'opacity-0')
            : (isHoveringImages && !isOnButton && !isDragging ? 'opacity-100' : 'opacity-0')

          const baseScale = isMobile
            ? (side.key === 'before' ? (position < 20 ? 1 : 1.2) : (position > 80 ? 1 : 1.2))
            : (side.key === 'before' ? (position < 20 ? 0.6 : 1) : (position > 80 ? 0.6 : 1))

          const scale = (baseScale * (labelScale ?? 1) * responsiveScale).toFixed(3)

          return (
            <div
              key={side.key}
              className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${visibleClass}`}
              style={side.style}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span
                  className={`text-white ${isMobile ? 'text-base md:text-lg' : 'text-2xl md:text-4xl'} font-bold uppercase tracking-wider drop-shadow-lg transition-transform duration-300`}
                  style={{ transform: `rotate(${side.rotated ? 90 : 0}deg) scale(${scale})` }}
                >
                  {side.label}
                </span>
              </div>
            </div>
          )
        })}

      {/* Handle & divider */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-0 bottom-0 w-px bg-white/80" aria-hidden />
        <button
          className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/80 bg-white/80 text-gray-800 shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setIsOnButton(true)}
          onMouseLeave={() => setIsOnButton(false)}
          aria-label="Vorher/Nachher anpassen"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          role="slider"
        >
          <div className="flex items-center gap-1 text-xs font-semibold">
            <span>↔</span>
          </div>
        </button>
      </div>
    </div>
  )
}
