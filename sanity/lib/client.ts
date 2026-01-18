import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const getClient = (dataset: string, useCdn = false) =>
  createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    // Use SANITY_TOKEN for reads, fallback to SANITY_API_WRITE_TOKEN for writes
    token: process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  });

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});
