import clients from "@/data/clients";

export function resolveClient(host: string) {
  return clients.find((c: any) => {
    if (Array.isArray(c.domains))
      return c.domains.some((d: string) => host.includes(d));
    if (c.domain) return host.includes(c.domain);
    return false;
  });
}
