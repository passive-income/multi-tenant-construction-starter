import { NextResponse } from "next/server";
import { getHost } from "@/lib/utils/host";
import { getSiteData } from "@/lib/data";
import clients from "@/data/clients";

export async function GET() {
  const host = await getHost();

  // Try to detect client by domain in `clients` first (support both `domain` and `domains` formats)
  const clientMeta =
    clients.find((c: any) =>
      c.domain === host ||
      (Array.isArray(c.domains) && c.domains.includes(host)),
    ) || clients[0];
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type || "json",
    source: clientMeta.source ?? clientMeta.name ?? "",
  };

  try {
    const data = await getSiteData(clientForSiteData, host);
    return NextResponse.json({ host, client: clientForSiteData.source, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 },
    );
  }
}
