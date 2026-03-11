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
      .from(schema.items)
      .where(isNull(schema.items.deletedAt))
      .all();

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type NewItem = typeof schema.items.$inferInsert;
  const body = (await request.json()) as NewItem;

  const result = await db.insert(schema.items).values(body).returning();

  return Response.json(result);
}

export async function PATCH(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type UpdateItem = Partial<typeof schema.items.$inferInsert> & { id: number };
  
  // 2. Parse the body and separate the ID from the fields being updated
  const body = (await request.json()) as UpdateItem;
  const { id, ...updateData } = body;

  if (!id) {
    return Response.json({ error: "Missing item ID" }, { status: 400 });
  }

  // 3. Perform the update
  const result = await db
    .update(schema.items)
    .set(updateData)
    .where(eq(schema.items.id, id))
    .returning();

  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  type UpdateItem = Partial<typeof schema.items.$inferInsert> & { id: number };

  // 2. Parse the body and separate the ID from the fields being updated
  const body = (await request.json()) as UpdateItem;
  const { id, ...updateData } = body;

  if (!id) {
    return Response.json({ error: "Missing item ID" }, { status: 400 });
  }

  // Perform a soft delete by updating the deletedAt timestamp
  const result = await db
    .update(schema.items)
    .set({ deletedAt: new Date() }) 
    .where(eq(schema.items.id, id))
    .returning();

  return Response.json(result);
}