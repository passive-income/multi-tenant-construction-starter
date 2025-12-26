Tenant scoping and examples

This project supports tenant-scoped content from Sanity. The key points:

- Sanity `client` documents contain a `clientId` and a `domains` array. The app resolves the current tenant by hostname and fetches only documents with `clientId` matching that tenant.

Examples

1) In server components (how to get the host and call `getSiteData`):

```ts
import { headers } from 'next/headers'
import { getSiteData } from '@/lib/data'

const host = headers().get('host')
// clientMeta can be from cookie or your mapping; ensure it has `type` and `source`.
const clientForSiteData = { type: 'sanity', source: 'production', /* ... */ }
const siteData = await getSiteData(clientForSiteData, host)
```

2) Use the demo API route

Start the app and request `/api/tenant-demo` from the browser (or via `curl`). The route reads the `Host` header and returns the tenant-scoped data for quick verification.

3) GROQ examples (use these in `lib/data/sanity.ts` or other fetches):

```groq
// resolve client by host
*[_type == "client" && $host in domains][0]

// fetch services for a clientId
*[_type == "service" && clientId == $clientId]
```

Security note

- Always use a Sanity write token with care. Store it in `.env.local` and never commit it.
- Ensure queries filter by `clientId` or use the `client` document references to avoid cross-tenant leakage.
