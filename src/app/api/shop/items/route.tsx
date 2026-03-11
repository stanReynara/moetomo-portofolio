import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

// Ensure this is present
export const runtime = "edge";

export async function GET() {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB, { schema });

  const result = await db.select().from(schema.items).all();

  return Response.json(result);
}