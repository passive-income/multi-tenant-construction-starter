import fs from "fs/promises";
import path from "path";
import type { SiteData } from "@/lib/types/site";

export async function getJsonData(fileName: string): Promise<SiteData> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as SiteData;
}
