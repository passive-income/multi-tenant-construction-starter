import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Sanity Webhook Handler
 * Receives webhooks from Sanity when content is published/unpublished
 * Triggers on-demand revalidation to clear the cache instantly
 *
 * Setup in Sanity:
 * 1. Go to Sanity Studio Settings → Webhooks
 * 2. Create new webhook:
 *    - URL: https://your-domain.com/api/revalidate
 *    - Events: Publish document, Unpublish document
 *    - Include draft content: No
 *    - Include previous version: No
 * 3. Add secret token (same as SANITY_WEBHOOK_SECRET env var)
 */

export async function POST(request: NextRequest) {
  try {
    // Optional: disable webhook when using dashboard-only updates
    if (process.env.SANITY_WEBHOOK_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'Webhook disabled: use dashboard endpoint' },
        { status: 404 },
      );
    }

    // Verify webhook secret
    const secret =
      request.headers.get('sanity-webhook-secret') ||
      request.headers.get('x-sanity-webhook-secret');
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      console.warn('[Revalidate] Webhook secret mismatch or missing');
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    const body = await request.json();
    const { _type, clientId, slug } = body;

    if (!_type) {
      return NextResponse.json({ error: 'Missing _type in webhook payload' }, { status: 400 });
    }

    console.log(`[Revalidate] Webhook received for type: ${_type}`, {
      clientId,
      slug,
    });

    // Revalidate all sites (all hosts) by clearing site-specific tags
    // This ensures all multi-tenant instances get fresh data
    const tagsToRevalidate: string[] = [];

    switch (_type) {
      case 'client':
        // Client document changed - revalidate all pages for this client
        if (clientId) {
          tagsToRevalidate.push(`site-${clientId}`);
        }
        // Also revalidate all sites since client config might affect rendering
        tagsToRevalidate.push('all-sites');
        break;

      case 'page':
      case 'service':
      case 'project':
      case 'contactSettings':
      case 'footer':
      case 'navigation':
        // Content changed - revalidate all sites
        tagsToRevalidate.push('all-sites');
        if (clientId) {
          tagsToRevalidate.push(`site-${clientId}`);
        }
        break;

      default:
        // Unknown type - revalidate all to be safe
        tagsToRevalidate.push('all-sites');
        break;
    }

    // Revalidate the tags
    const revalidatedTags = new Set<string>();
    for (const tag of tagsToRevalidate) {
      try {
        // Call revalidateTag with the single supported string tag.
        // (Only a single string argument is supported by this runtime API.)
        await revalidateTag(tag, {});
        revalidatedTags.add(tag);
        console.log(`[Revalidate] Cleared cache tag: ${tag}`);
      } catch (error) {
        console.error(`[Revalidate] Failed to revalidate tag ${tag}:`, error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Revalidated ${revalidatedTags.size} cache tags`,
        tags: Array.from(revalidatedTags),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[Revalidate] Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return NextResponse.json(
    { message: 'OK' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, sanity-webhook-secret, x-sanity-webhook-secret',
      },
    },
  );
}
