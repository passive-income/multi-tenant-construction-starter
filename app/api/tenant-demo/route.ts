import { NextResponse } from 'next/server';
import { getJsonData } from '@/lib/data/json';
import { getSanityData } from '@/lib/data/sanity';
import { getHost } from '@/lib/utils/host';

export async function GET() {
  const host = await getHost();

  try {
    let data = null;
    let source = 'sanity';
    try {
      data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production', host);
    } catch (_e) {
      source = 'json';
      data = await getJsonData('static-mueller.json');
    }
    return NextResponse.json({ host, source, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
