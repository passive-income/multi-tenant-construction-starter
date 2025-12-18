import clients from '@/data/clients.json'

export function resolveClient(host: string) {
  return clients.find((c: any) => host.includes(c.domain))
}
