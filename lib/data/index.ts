import { getJsonData } from "./json";
import { getSanityData } from "./sanity";
import type { SiteData } from "@/lib/types/site";
import type { ClientMeta } from "@/lib/types/client";

export async function getSiteData(
  client: ClientMeta,
  host?: string,
): Promise<SiteData> {
  if (!client || !client.type || !client.source) {
    throw new Error(
      `Malformed client object passed to getSiteData: ${JSON.stringify(client)}`,
    );
  }

  if (client.type === "json") return getJsonData(client.source);
  if (client.type === "sanity") return getSanityData(client.source, host);

  throw new Error(`Unknown client type: ${client.type}`);
}
