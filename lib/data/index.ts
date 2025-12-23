import { getJsonData } from './json'
import { getSanityData } from './sanity'

export async function getSiteData(client: any) {
  if (!client || !client.type || !client.source) {
    throw new Error(`Malformed client object passed to getSiteData: ${JSON.stringify(client)}`);
  }

  if (client.type === 'json') return getJsonData(client.source)
  if (client.type === 'sanity') return getSanityData(client.source)
  throw new Error(`Unknown client type: ${client.type}`)
}