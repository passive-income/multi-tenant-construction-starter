# Dashboard Integration

Use your dashboard to publish content to Sanity and then trigger tenant-scoped cache revalidation on the site.

## Prerequisites
- Environment vars on the site:
  - `DASHBOARD_API_SECRET`: for dashboard → site API calls
  - Optional: `SANITY_WEBHOOK_ENABLED=true` + `SANITY_WEBHOOK_SECRET` if you keep the Studio webhook as a fallback
- Site endpoints:
  - `POST /api/revalidate/tenant` — revalidate a specific tenant
  - `POST /api/revalidate` — optional: Sanity webhook

## Tenant Revalidation API
Endpoint is implemented at `app/api/revalidate/tenant/route.ts`. It accepts either `clientId` or `host` and revalidates only per-tenant tags (`site-{host}`) by default.

Example (cURL):

```bash
curl -X POST https://your-domain.com/api/revalidate/tenant \
  -H "Content-Type: application/json" \
  -H "x-dashboard-secret: $DASHBOARD_API_SECRET" \
  -d '{ "clientId": "mueller" }'
```

Or target a single domain:

```bash
curl -X POST https://your-domain.com/api/revalidate/tenant \
  -H "Content-Type: application/json" \
  -H "x-dashboard-secret: $DASHBOARD_API_SECRET" \
  -d '{ "host": "muellerbau.de" }'
```

## Programmatic Usage (SDK)
Import helper from `lib/dashboard/revalidate.ts` in your dashboard codebase (copy this file if separate repos).

```ts
import { revalidateTenant, publishThenRevalidate } from './lib/dashboard/revalidate';

// Just revalidate
await revalidateTenant({
  baseUrl: 'https://your-domain.com',
  secret: process.env.DASHBOARD_API_SECRET!,
  clientId: 'mueller',
});

// Publish in Sanity, then revalidate
const publishFn = async () => {
  // Example using Sanity client
  // await sanityClient.createOrReplace({ _id: 'page.mueller.home', _type: 'page', ... })
};

const result = await publishThenRevalidate(publishFn, {
  baseUrl: 'https://your-domain.com',
  secret: process.env.DASHBOARD_API_SECRET!,
  clientId: 'mueller',
});

if (!result.publishOk) {
  // handle publish failure
}
if (!result.revalidate.success) {
  // handle revalidation failure
}
```

## Notes
- The site caches are tagged with `all-sites` and `site-{host}`; tenant endpoint revalidates per-host tags only to keep calls minimal.
- Webhook is optional: set `SANITY_WEBHOOK_ENABLED=false` (default) and remove the webhook in Studio to rely solely on dashboard.
- If you need to flush shared/global caches, either add `all-sites` back in the tenant endpoint or enable the Studio webhook and call `/api/revalidate`.
- Calls should be made to your production domain over HTTPS.
