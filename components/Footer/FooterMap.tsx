"use client"

import { useEffect, useState } from 'react'

interface FooterMapProps {
  address: string | undefined
  href?: string
  fallbackSrc?: string
}

export function FooterMap({ address, href, fallbackSrc }: FooterMapProps) {
  const [generatedMapUrl, setGeneratedMapUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (!address) return
    let cancelled = false
    setIsLoading(true)
    fetch(`/api/map?address=${encodeURIComponent(address)}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return
        if (j?.url) setGeneratedMapUrl(j.url)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [address])

  const src = generatedMapUrl ?? fallbackSrc

  if (!src) {
    return isLoading ? <MapLoader /> : <p className="text-sm text-muted">Adresse nicht verfügbar</p>
  }

  if (imgError) {
    return (
      <div>
        <a href={href} target="_blank" rel="noreferrer noopener" className="block mb-2 mx-auto sm:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/static-map-placeholder.svg" alt="Karte nicht verfügbar" className="w-full max-w-[420px] sm:max-w-xs h-40 object-cover rounded shadow-md bg-white" />
        </a>
        <Attribution />
      </div>
    )
  }

  return (
    <div>
      <a href={href} target="_blank" rel="noreferrer noopener" className="block mb-2 relative mx-auto sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Standort"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="w-full max-w-105 sm:max-w-xs h-50 md:h-40 object-cover rounded shadow-md"
        />
        {(!imgLoaded || (isLoading && !generatedMapUrl)) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded shadow-inner">
            <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" aria-label="Map wird geladen" />
          </div>
        )}
      </a>
      <Attribution loading={!imgLoaded || (isLoading && !generatedMapUrl)} />
    </div>
  )
}

function Attribution({ loading }: { loading?: boolean }) {
  return (
    <div className="hidden sm:block text-xs text-muted">
      <span className="block">Zu Google Maps einfach klicken</span>
      <span className="block mt-1">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors</span>
      {loading && <span className="block mt-1 text-[11px] text-gray-500">Karte wird generiert …</span>}
    </div>
  )
}

function MapLoader() {
  return (
    <div className="w-full max-w-105 sm:max-w-xs h-50 md:h-40 rounded shadow-md bg-gray-200 animate-pulse mx-auto sm:mx-0" aria-label="Map wird vorbereitet" />
  )
}
