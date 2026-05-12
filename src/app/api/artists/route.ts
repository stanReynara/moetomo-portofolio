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
  console.log("\n--- [START] PATCH /api/artists ---");
  
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    // Log environment bindings to ensure DB and BUCKET exist
    console.log("[ENV] Keys available:", Object.keys(env));
    console.log("[ENV] BUCKET binding:", env.BUCKET ? "✅ Found" : "❌ MISSING!");
    
    const db = drizzle(env.DB, { schema });

    // 1. Parse the multipart/form-data
    console.log("[FORMDATA] Parsing request...");
    const formData = await request.formData();
    
    // Log EVERY piece of data sent from the client
    console.log("[FORMDATA] Contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  -> ${key}: [File] name="${value.name}", size=${value.size} bytes, type="${value.type}"`);
      } else {
        const strVal = value as string;
        console.log(`  -> ${key}: [Text] "${strVal.length > 50 ? strVal.substring(0, 50) + '...' : strVal}"`);
      }
    }

    const idString = formData.get("id") as string;
    if (!idString) {
      console.error("[ERROR] Missing artist ID in form data.");
      return Response.json({ error: "Missing artist ID" }, { status: 400 });
    }
    
    const id = parseInt(idString, 10);

    // 2. Extract standard text fields
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const socialsString = formData.get("socials") as string | null;

    const updateData: Partial<typeof schema.artists.$inferInsert> = {};
    if (name) updateData.name = name;
    if (description !== null) updateData.description = description; 
    
    if (socialsString) {
      try {
        updateData.socials = JSON.parse(socialsString);
      } catch (e) {
        console.error("[ERROR] Failed to parse socials JSON:", e);
      }
    } else {
      updateData.socials = null;
    }

    // 3. Handle File Uploads
    const r2Bucket = env.BUCKET as R2Bucket | undefined;

    // --- AVATAR UPLOAD ---
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile) {
      if (avatarFile.size > 0) {
        console.log(`[R2 UPLOAD] Attempting to upload Avatar: ${avatarFile.name}`);
        if (!r2Bucket) throw new Error("R2 Bucket binding not found for avatar upload");
        
        const buffer = await avatarFile.arrayBuffer();
        const path = `avatars/${id}/${avatarFile.name}`;
        
        await r2Bucket.put(path, buffer, {
          httpMetadata: { contentType: avatarFile.type }
        });
        
        updateData.avatar = `/${path}`; 
        console.log(`[R2 UPLOAD] ✅ Avatar uploaded successfully to: /${path}`);
      } else {
        console.log("[R2 UPLOAD] Avatar file received but size is 0. Skipping upload.");
      }
    } else {
      console.log("[R2 UPLOAD] No avatar file field found in request.");
    }

    // --- POLAROID UPLOAD ---
    const polaroidFile = formData.get("polaroid") as File | null;
    if (polaroidFile) {
      if (polaroidFile.size > 0) {
        console.log(`[R2 UPLOAD] Attempting to upload Polaroid: ${polaroidFile.name}`);
        if (!r2Bucket) throw new Error("R2 Bucket binding not found for polaroid upload");

        const buffer = await polaroidFile.arrayBuffer();
        const path = `polaroids/${id}/${polaroidFile.name}`;
        
        await r2Bucket.put(path, buffer, {
          httpMetadata: { contentType: polaroidFile.type }
        });
        
        updateData.polaroid = `/${path}`; 
        console.log(`[R2 UPLOAD] ✅ Polaroid uploaded successfully to: /${path}`);
      } else {
        console.log("[R2 UPLOAD] Polaroid file received but size is 0. Skipping upload.");
      }
    } else {
      console.log("[R2 UPLOAD] No polaroid file field found in request.");
    }

    // 4. Perform the D1 database update
    console.log("[DB] Executing DB update with data:", updateData);
    const result = await db
      .update(schema.artists)
      .set(updateData)
      .where(eq(schema.artists.id, id))
      .returning();

    console.log("[DB] ✅ Database updated successfully.");
    console.log("--- [END] PATCH /api/artists SUCCESS ---\n");
    return Response.json(result);
    
  } catch (error: any) {
    console.error("\n--- [ERROR] PATCH /api/artists FAILED ---");
    console.error("Error Details:", error);
    console.error("Stack Trace:", error.stack);
    console.log("-------------------------------------------\n");
    return Response.json({ error: error.message }, { status: 500 });
  }
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