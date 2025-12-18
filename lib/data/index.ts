import { getJsonData } from './json'
import { getSanityData } from './sanity'

export async function getSiteData(client: any) {
  if (client.type === 'json') return getJsonData(client.source)
  if (client.type === 'sanity') return getSanityData(client.source)
  throw new Error(`Unknown client type: ${client.type}`)
}
