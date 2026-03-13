import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    if (!env.DB) {
      return Response.json({ error: "Database binding missing" }, { status: 500 });
    }

    const db = drizzle(env.DB, { schema });

    const result = await db
      .select()
      .from(schema.artists)
      .where(isNull(schema.artists.deletedAt))
      .all();

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type NewArtist = typeof schema.artists.$inferInsert;
  const body = (await request.json()) as NewArtist;

  const result = await db.insert(schema.artists).values(body).returning();

  return Response.json(result);
}

export async function PATCH(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type UpdateArtist = Partial<typeof schema.artists.$inferInsert> & { id: number };
  
  // 2. Parse the body and separate the ID from the fields being updated
  const body = (await request.json()) as UpdateArtist;
  const { id, ...updateData } = body;

  if (!id) {
    return Response.json({ error: "Missing artist ID" }, { status: 400 });
  }

  // 3. Perform the update
  const result = await db
    .update(schema.artists)
    .set(updateData)
    .where(eq(schema.artists.id, id))
    .returning();

  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type DeleteArtist = { id: number };
  const body = (await request.json()) as DeleteArtist;

  if (!body.id) {
    return Response.json({ error: "Missing artist ID" }, { status: 400 });
  }

  // Soft delete by setting deletedAt to current timestamp
  const result = await db
    .update(schema.artists)
    .set({ deletedAt: new Date() })
    .where(eq(schema.artists.id, body.id))
    .returning();

  return Response.json(result);
}