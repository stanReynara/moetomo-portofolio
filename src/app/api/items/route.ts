// src/app/api/items/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";

export const dynamic = "force-dynamic";

// ==========================================
// GET: Fetch all active items
// ==========================================
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

// ==========================================
// POST: Create a new item (with Image Upload)
// ==========================================
export async function POST(request: Request) {
  console.log("\n--- [START] POST /api/items ---");
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });
    const formData = await request.formData();

    // 1. Extract standard fields
    const name = formData.get("name") as string;
    const priceString = formData.get("price") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string | null;

    if (!name || !priceString || !type) {
      return Response.json({ error: "Missing required fields (name, price, type)" }, { status: 400 });
    }

    const price = parseInt(priceString, 10);

    // 2. Insert into DB FIRST to get the auto-incremented ID
    console.log("[DB] Inserting initial record to generate ID...");
    const [newItem] = await db
      .insert(schema.items)
      .values({ name, price, type, description })
      .returning();

    // 3. Handle File Upload using the newly generated ID
    const r2Bucket = env.BUCKET as R2Bucket | undefined;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      console.log(`[R2 UPLOAD] Attempting to upload: ${imageFile.name}`);
      if (!r2Bucket) throw new Error("R2 Bucket binding not found");

      const buffer = await imageFile.arrayBuffer();
      const path = `items/${newItem.id}/${imageFile.name}`;
      
      await r2Bucket.put(path, buffer, {
        httpMetadata: { contentType: imageFile.type }
      });

      const imageUrl = `/${path}`;
      console.log(`[R2 UPLOAD] ✅ Uploaded successfully to: ${imageUrl}`);

      // 4. Update the newly created item with the image URL
      await db
        .update(schema.items)
        .set({ imageUrl })
        .where(eq(schema.items.id, newItem.id));
      
      newItem.imageUrl = imageUrl; // Update the object we return to the frontend
    }

    console.log("--- [END] POST /api/items SUCCESS ---\n");
    return Response.json(newItem);

  } catch (error: any) {
    console.error("\n--- [ERROR] POST /api/items FAILED ---", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// PATCH: Update an existing item
// ==========================================
export async function PATCH(request: Request) {
  console.log("\n--- [START] PATCH /api/items ---");
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });
    const formData = await request.formData();
    
    const idString = formData.get("id") as string;
    if (!idString) {
      return Response.json({ error: "Missing item ID" }, { status: 400 });
    }
    const id = parseInt(idString, 10);

    // 1. Extract standard text fields
    const name = formData.get("name") as string | null;
    const priceString = formData.get("price") as string | null;
    const type = formData.get("type") as string | null;
    const description = formData.get("description") as string | null;

    const updateData: Partial<typeof schema.items.$inferInsert> = {};
    if (name) updateData.name = name;
    if (priceString) updateData.price = parseInt(priceString, 10);
    if (type) updateData.type = type;
    if (description !== null) updateData.description = description; 

    // 2. Handle File Upload
    const r2Bucket = env.BUCKET as R2Bucket | undefined;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      console.log(`[R2 UPLOAD] Attempting to upload new image: ${imageFile.name}`);
      if (!r2Bucket) throw new Error("R2 Bucket binding not found");
      
      const buffer = await imageFile.arrayBuffer();
      const path = `items/${id}/${imageFile.name}`;
      
      await r2Bucket.put(path, buffer, {
        httpMetadata: { contentType: imageFile.type }
      });
      
      updateData.imageUrl = `/${path}`; 
      console.log(`[R2 UPLOAD] ✅ Image updated to: /${path}`);
    }

    // 3. Perform the DB update
    console.log("[DB] Executing DB update...");
    const result = await db
      .update(schema.items)
      .set(updateData)
      .where(eq(schema.items.id, id))
      .returning();

    console.log("--- [END] PATCH /api/items SUCCESS ---\n");
    return Response.json(result);
    
  } catch (error: any) {
    console.error("\n--- [ERROR] PATCH /api/items FAILED ---", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// DELETE: Soft delete an item
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    type DeleteItem = { id: number };
    const body = (await request.json()) as DeleteItem;

    if (!body.id) {
      return Response.json({ error: "Missing item ID" }, { status: 400 });
    }

    // Soft delete by setting deletedAt to current timestamp
    const result = await db
      .update(schema.items)
      .set({ deletedAt: new Date() })
      .where(eq(schema.items.id, body.id))
      .returning();

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}