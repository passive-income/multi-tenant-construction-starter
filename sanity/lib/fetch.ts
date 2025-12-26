export async function sanityFetch(client: any, query: string, params = {}) {
  return client.fetch(query, params);
}
