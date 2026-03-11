import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";

export const runtime = "edge";

export async function GET() {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB, { schema });

  // Only select items where deletedAt has no value
  const result = await db
    .select()
    .from(schema.items)
    .where(isNull(schema.items.deletedAt))
    .all();

  return Response.json(result);
}

export async function POST(request: Request) {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB, { schema });

  type NewItem = typeof schema.items.$inferInsert;
  const body = (await request.json()) as NewItem;

  const result = await db.insert(schema.items).values(body).returning();

  return Response.json(result);
}

export async function PATCH(request: Request) {
  const { env } = await getCloudflareContext();
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
  const { env } = await getCloudflareContext();
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