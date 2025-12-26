import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2021-03-25",
  useCdn: false,
});

export function extractClientIdFromHostOrPath(
  host: string,
  pathname: string,
): string | null {
  const parts = host.split(".");
  if (parts.length > 2 && !/localhost/.test(host)) {
    return parts[0];
  }
  const match = pathname.match(/^\/([^\/]+)/);
  return match ? match[1] : null;
}

export async function getTenant({
  host,
  pathname,
}: {
  host: string;
  pathname: string;
}) {
  let tenant = await sanityClient.fetch(
    `*[_type == "client" && $host in domains][0]`,
    { host },
  );

  if (!tenant) {
    const clientId = extractClientIdFromHostOrPath(host, pathname);
    if (!clientId) return null;
    tenant = await sanityClient.fetch(
      `*[_type == "client" && clientId == $clientId][0]`,
      { clientId },
    );
  }
  return tenant;
}
