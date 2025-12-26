"use client";

import dynamic from "next/dynamic";

const ClientOnlyAnalytics = dynamic(() => import("./ClientOnlyAnalytics"), {
  ssr: false,
});

export function AnalyticsWrapper() {
  return <ClientOnlyAnalytics />;
}
