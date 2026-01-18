# Sanity Webhook Setup Guide

## Overview

This app uses **Sanity Webhooks** to trigger instant cache revalidation when content is published. Instead of waiting 5-10 minutes for the cache to expire, your changes appear immediately on the live site.

## How It Works

1. You publish/unpublish content in Sanity
2. Sanity sends a webhook POST request to your app
3. Your app receives it and clears the relevant cache tags
4. Next visitor gets fresh data instantly

## Setup Steps

### 1. Generate a Webhook Secret

First, create a secure random string for webhook authentication:

```bash
# Generate a strong secret
openssl rand -hex 32
# Example output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### 2. Add Environment Variable

Add the secret to your `.env.local` file:

```env
SANITY_WEBHOOK_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### 3. Deploy Your App

The webhook endpoint must be publicly accessible. Make sure your app is deployed (Vercel, etc.) and running at:

```
https://your-domain.com/api/revalidate
```

### 4. Set Up Webhook in Sanity Studio

1. Go to your **Sanity Studio** (usually at `/studio`)
2. Navigate to **Settings** → **API** → **Webhooks**
3. Click **Create Webhook**
4. Fill in the following details:

   **Title**: `Cache Revalidation`
   
   **URL**: `https://your-domain.com/api/revalidate`
   
   **Trigger on**:
   - ✅ **Publish document** (publish changes immediately)
   - ✅ **Unpublish document** (clear cache when content is removed)
   
   **Include draft content**: ❌ No
   
   **Include previous version**: ❌ No
   
   **Secret**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f`
   (same as `SANITY_WEBHOOK_SECRET`)
   
   **HTTP Headers** (optional, for extra security):
   ```json
   {
     "x-sanity-webhook-secret": "your-secret-here"
   }
   ```

5. Click **Create**

6. Test the webhook by clicking **Test** in the webhook details page

## Testing

### Manual Test

You can test the webhook manually:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "sanity-webhook-secret: your-secret-here" \
  -H "Content-Type: application/json" \
  -d '{"_type": "page", "clientId": "your-client-id"}'
```

### In Sanity Studio

1. Go to Settings → API → Webhooks
2. Find your webhook
3. Click **Test** to send a test request
4. Check the response in the **Event log**

## What Gets Revalidated

When a webhook fires, these tags are cleared:

| Document Type | Tags Cleared |
|---|---|
| `page` | `all-sites`, `site-{clientId}` |
| `service` | `all-sites`, `site-{clientId}` |
| `project` | `all-sites`, `site-{clientId}` |
| `contactSettings` | `all-sites`, `site-{clientId}` |
| `footer` | `all-sites`, `site-{clientId}` |
| `navigation` | `all-sites`, `site-{clientId}` |
| `client` | `all-sites`, `site-{clientId}` |

## Monitoring

Check your app logs to see webhook activity:

```
[Revalidate] Webhook received for type: page
[Revalidate] Cleared cache tag: all-sites
[Revalidate] Cleared cache tag: site-{clientId}
[Revalidate] Revalidated 2 cache tags
```

## Troubleshooting

### Webhook not triggering?

1. **Check the URL** - Make sure `https://your-domain.com/api/revalidate` is correct
2. **Verify secret** - The `sanity-webhook-secret` header must match `SANITY_WEBHOOK_SECRET`
3. **Check environment variable** - Make sure `SANITY_WEBHOOK_SECRET` is set in production
4. **View event logs** - In Sanity Settings → Webhooks → Your Webhook → Event log

### Changes not appearing?

1. **Wait a few seconds** - Network latency, cache clearing takes time
2. **Hard refresh** - Try `Cmd+Shift+R` or `Ctrl+Shift+F5` to bypass browser cache
3. **Check logs** - Look at server logs for any errors
4. **Test manually** - Use the curl command above to verify webhook is working

## Security

⚠️ **Important**: Always use `SANITY_WEBHOOK_SECRET` to verify webhook authenticity. The webhook route checks:

1. Request header `sanity-webhook-secret` matches the environment variable
2. Only valid requests trigger cache revalidation
3. Invalid requests return 401 Unauthorized

## Performance Impact

- **Before webhook**: Up to 5-10 minute delay for content updates
- **With webhook**: Instant revalidation (usually < 5 seconds)
- **Cache hits**: No performance impact, instant serving
- **Cache misses**: Single Sanity API call per revalidation

## Best Practices

1. **Keep the secret private** - Never commit it to git
2. **Use HTTPS only** - Webhooks should only work over HTTPS
3. **Monitor logs** - Check server logs periodically for webhook failures
4. **Test after deployment** - Verify webhook works after deploying to production
5. **Document your setup** - Keep this setup documented for your team

## Disabling Webhooks

If you want to temporarily disable webhooks:

1. In Sanity Studio, go to Settings → API → Webhooks
2. Click on your webhook and toggle the **Enabled** switch off
3. Click **Save**

The app will still work, but will use time-based revalidation (5-10 minute delay).
