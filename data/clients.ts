import type { ClientMeta } from "@/lib/types/client";

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const clients: ClientMeta[] = [
  // Local demo clients that point to the project's Sanity dataset
  {
    name: "Alpha (local)",
    type: "sanity",
    source: dataset,
    domains: ["localhost:3010", "alpha.local"],
    theme: { primaryColor: "#0B74DE", accentColor: "#F97316" },
  },
  {
    name: "Beta (local)",
    type: "sanity",
    source: dataset,
    domains: ["localhost:3001", "beta.local"],
    theme: { primaryColor: "#0F766E", accentColor: "#E11D48" },
  },
  {
    name: "Müller Bau GmbH",
    type: "json",
    source: "static-mueller.json",
    domains: ["localhost:3000"],
    theme: { primaryColor: "#1E3A8A", accentColor: "#F59E0B" },
  },
  {
    name: "Schmidt Construction",
    type: "sanity",
    source: "schmidt-dataset",
    domains: ["schmidtbau.de"],
    theme: { primaryColor: "#059669", accentColor: "#FBBF24" },
  },
];

export default clients;
