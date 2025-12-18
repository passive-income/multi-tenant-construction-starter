import { NextRequest, NextResponse } from 'next/server'
import { resolveClient } from '@/lib/resolveClient'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const client = resolveClient(host)
  if (!client) return NextResponse.rewrite(new URL('/no-client', req.url))

  const res = NextResponse.next()
  res.cookies.set('clientId', client.name)
  return res
}

export const config = { matcher: ['/'] }
