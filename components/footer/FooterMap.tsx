"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FooterMapProps {
  clientId?: string;
  address: string | undefined;
  href?: string;
}

export function FooterMap({ clientId, address, href }: FooterMapProps) {
  const [generatedMapUrl, setGeneratedMapUrl] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    setIsLoading(true);
    const params = new URLSearchParams({ address });
    if (clientId) params.set('clientId', clientId);
    fetch(`/api/map?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.error) {
          console.error('[FooterMap] API error:', j.error, j.detail);
          setImgError(true);
        } else if (j?.url) {
          setGeneratedMapUrl(j.url);
        }
      })
      .catch((e) => {
        console.error('[FooterMap] Fetch failed:', e);
        setImgError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address, clientId]);

  const src = generatedMapUrl;

  // Always render container with fixed dimensions to prevent CLS
  if (!src && !isLoading) {
    return (
      <div style={{minHeight: '200px'}}>
        <div style={{display: 'block', width: '100%', maxWidth: '400px', height: '200px', margin: '0 auto'}} className="sm:mx-0">
          <p className="text-sm text-muted flex items-center justify-center h-full">Adresse nicht verfügbar</p>
        </div>
      </div>
    );
  }

  if (!src && isLoading) {
    return <MapLoader />;
  }

  if (imgError) {
    return (
      <div style={{minHeight: '200px'}}>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="block mb-2 mx-auto sm:mx-0"
          style={{display: 'block', width: '100%', maxWidth: '400px', height: '200px'}}
        >
          <Image
            src="/static-map-placeholder.svg"
            alt="Karte nicht verfügbar"
            width={400}
            height={200}
            className="w-full h-full object-cover rounded shadow-md bg-white"
          />
        </a>
        <Attribution />
      </div>
    );
  }

  return (
    <div style={{minHeight: '200px'}}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="block mb-2 relative mx-auto sm:mx-0"
        style={{display: 'block', width: '100%', maxWidth: '400px', height: '200px'}}
      >
        <Image
          src={src as string}
          alt="Standort"
          width={400}
          height={200}
          unoptimized
          onLoadingComplete={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded shadow-md"
        />
        {(!imgLoaded || (isLoading && !generatedMapUrl)) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded shadow-inner">
            <div
              className="h-8 w-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"
              aria-label="Map wird geladen"
            />
          </div>
        )}
      </a>
      <Attribution loading={!imgLoaded || (isLoading && !generatedMapUrl)} />
    </div>
  );
}

function Attribution({ loading }: { loading?: boolean }) {
  return (
    <div className="text-xs">
      <span className="mt-1">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </span>
    </div>
  );
}

function MapLoader() {
  return (
    <div style={{minHeight: '200px'}}>
      <div
        className="rounded shadow-md bg-gray-200 animate-pulse mx-auto sm:mx-0"
        style={{width: '100%', maxWidth: '400px', height: '200px'}}
        aria-label="Map wird vorbereitet"
      />
    </div>
  );
}
