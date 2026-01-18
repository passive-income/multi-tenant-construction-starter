export type RevalidateResult = {
  success?: boolean;
  tags?: string[];
  error?: string;
  status?: number;
};

type TenantParams = {
  baseUrl: string; // e.g. https://your-domain.com
  secret: string; // DASHBOARD_API_SECRET
  clientId?: string;
  host?: string;
  timeoutMs?: number;
};

/**
 * Trigger tenant-scoped revalidation via the site API.
 */
export async function revalidateTenant(params: TenantParams): Promise<RevalidateResult> {
  const { baseUrl, secret, clientId, host, timeoutMs = 10000 } = params;
  if (!baseUrl) throw new Error('baseUrl is required');
  if (!secret) throw new Error('secret is required');
  if (!clientId && !host) throw new Error('Provide clientId or host');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/api/revalidate/tenant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dashboard-secret': secret,
      },
      body: JSON.stringify({ clientId, host }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = (await res.json()) as RevalidateResult;
    return { ...json, status: res.status };
  } catch (err: any) {
    clearTimeout(timer);
    return { error: err?.message || 'Request failed', status: 0 };
  }
}

/**
 * Compose a publish step (e.g., Sanity mutation) and revalidate.
 * Pass any async function that performs the publish.
 */
export async function publishThenRevalidate(
  publishFn: () => Promise<unknown>,
  revalidateParams: TenantParams,
): Promise<{ publishOk: boolean; revalidate: RevalidateResult }> {
  try {
    await publishFn();
    const result = await revalidateTenant(revalidateParams);
    return { publishOk: true, revalidate: result };
  } catch (err: any) {
    return { publishOk: false, revalidate: { error: err?.message, status: 0 } };
  }
}
