"use client"

import BeforeAfterGrid from '@/components/BeforeAfter/BeforeAfterGrid'
import type { BeforeAfterItem } from '@/components/BeforeAfter/BeforeAfterGrid'

interface BeforeAfterGridSectionProps {
  items: BeforeAfterItem[]
  columns?: number
  gap?: string
}

export function BeforeAfterGridSection({ items, columns, gap }: BeforeAfterGridSectionProps) {
  if (items.length === 0) return null
  
  return <BeforeAfterGrid items={items} columns={columns} gap={gap} />
}
