import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const getClient = (dataset: string, useCdn = false) =>
  createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    // Token selection: prefer SANITY_TOKEN if set, otherwise fall back to SANITY_API_WRITE_TOKEN.
    // Note: this is a simple fallback; choosing separate read/write tokens requires explicit logic per operation.
    token: process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  });

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN only when no authenticated token is present (public reads).
  useCdn: !process.env.SANITY_TOKEN,
  token: process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});
