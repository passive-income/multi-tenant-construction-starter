export type ClientType = "sanity" | "json";

export interface ClientMeta {
  name?: string;
  type: ClientType;
  source: string;
  domain?: string;
  // Additional optional metadata
  [key: string]: any;
}

export default ClientMeta;
