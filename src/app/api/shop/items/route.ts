import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";

export const runtime = "edge";

export async function GET() {
  try {
    const { env } = await getCloudflareContext();
    
    // Check 1: Is the database actually connected?
    if (!env.DB) {
      return Response.json({ error: "FATAL: env.DB binding is missing or undefined" }, { status: 500 });
    }

    const db = drizzle(env.DB, { schema });

    // Check 2: Can Drizzle query the tables?
    const result = await db
      .select()
      .from(schema.items)
      .where(isNull(schema.items.deletedAt))
      .all();

    return Response.json(result);

  } catch (error: any) {
    // Check 3: Catch any SQLite or D1 execution errors
    return Response.json({ 
      error: "Query Failed", 
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
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