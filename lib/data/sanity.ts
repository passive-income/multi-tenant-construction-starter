import { getClient } from '@/sanity/lib/client'
import { siteSettingsQuery, servicesQuery, projectsQuery } from '@/sanity/queries'

export async function getSanityData(dataset: string) {
  const client = getClient(dataset)
  const settings = await client.fetch(siteSettingsQuery)
  const services = await client.fetch(servicesQuery)
  const projects = await client.fetch(projectsQuery)
  return { company: settings, services, projects }
}
