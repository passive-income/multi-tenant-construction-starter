import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const dataset = req.nextUrl.searchParams.get("dataset");
  const slug = req.nextUrl.searchParams.get("slug");

  if (secret !== process.env.REVALIDATE_SECRET || !dataset || !slug) {
    return NextResponse.json({ message: "Invalid request" }, { status: 401 });
  }

  return NextResponse.redirect(`/${dataset}/${slug}`);
}
