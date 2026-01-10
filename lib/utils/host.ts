import { headers as nextHeaders } from 'next/headers';

/**
 * Return the Host header in a consistent way across Next versions.
 * Use `await getHost()` from async server components.
 */
export async function getHost(): Promise<string | undefined> {
  try {
    const maybe = (nextHeaders as any)();
    if (maybe && typeof maybe.then === 'function') {
      const resolved = await maybe;
      return resolved?.get?.('host') ?? undefined;
    }
    return maybe?.get?.('host') ?? undefined;
  } catch {
    return undefined;
  }
}

export function getHostSync(): string | undefined {
  try {
    const h = (nextHeaders as any)();
    return h?.get?.('host') ?? undefined;
  } catch {
    return undefined;
  }
}

export async function getHeader(name: string): Promise<string | undefined> {
  try {
    const maybe = (nextHeaders as any)();
    if (maybe && typeof maybe.then === 'function') {
      const resolved = await maybe;
      return resolved?.get?.(name) ?? undefined;
    }
    return maybe?.get?.(name) ?? undefined;
  } catch {
    return undefined;
  }
}

export function getHeaderSync(name: string): string | undefined {
  try {
    const h = (nextHeaders as any)();
    return h?.get?.(name) ?? undefined;
  } catch {
    return undefined;
  }
}
