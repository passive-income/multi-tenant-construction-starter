import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const getClient = (dataset: string, useCdn = true) => createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
