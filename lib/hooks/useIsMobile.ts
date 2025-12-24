"use client"

import { useEffect, useState } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      setIsMobile(isMobileUA)
    }

    // Check on mount
    checkMobile()

    // Listen for orientation changes on mobile
    window.addEventListener('orientationchange', checkMobile)
    return () => window.removeEventListener('orientationchange', checkMobile)
  }, [])

  return isMobile
}
