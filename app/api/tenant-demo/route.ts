import { NextResponse } from "next/server";
import { getHost } from "@/lib/utils/host";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData } from "@/lib/data/json";

export async function GET() {
  const host = await getHost();

  try {
    let data = null;
    let source = "sanity";
    try {
      data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production", host);
    } catch (e) {
      source = "json";
      data = await getJsonData("static-mueller.json");
    }
    return NextResponse.json({ host, source, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 },
    );
  }
}
