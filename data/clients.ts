import type { ClientMeta } from "@/lib/types/client";

const clients: ClientMeta[] = [
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
