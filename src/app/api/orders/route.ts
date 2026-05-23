import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { inArray, desc } from "drizzle-orm";
import * as schema from "@/db/schema";

export const dynamic = "force-dynamic";

type CartItem = {
  itemId: number;
  quantity: number;
};

type OrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  items: CartItem[];
};

export async function POST(request: Request) {
  console.log("\n--- [START] POST /api/orders ---");
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    if (!env.DB) {
      return Response.json({ error: "Database binding missing" }, { status: 500 });
    }

    const db = drizzle(env.DB, { schema });
    const body = (await request.json()) as OrderPayload;

    // 1. Validate required fields
    if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
      return Response.json(
        { error: "Missing required fields (customerName, customerEmail, items)" },
        { status: 400 }
      );
    }

    // 2. Fetch current prices securely from the database
    const itemIds = body.items.map((i) => i.itemId);
    console.log(`[DB] Fetching current prices for items: ${itemIds.join(", ")}`);
    
    const dbItems = await db
      .select({ id: schema.items.id, price: schema.items.price })
      .from(schema.items)
      .where(inArray(schema.items.id, itemIds))
      .all();

    // Create a map for quick price lookups
    const priceMap = new Map(dbItems.map((item) => [item.id, item.price]));

    // 3. Generate a UUID for the order
    const orderId = crypto.randomUUID();

    // 4. Insert the Order record
    console.log(`[DB] Creating order record: ${orderId}`);
    const [newOrder] = await db
      .insert(schema.orders)
      .values({
        id: orderId,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        notes: body.notes || null, 
        status: "PENDING",
      })
      .returning();

    // 5. Prepare and insert the Order Items
    console.log("[DB] Inserting order items...");
    const orderItemsToInsert = body.items.map((cartItem) => {
      const currentPrice = priceMap.get(cartItem.itemId);
      
      if (currentPrice === undefined) {
        throw new Error(`Item ID ${cartItem.itemId} not found or no longer available.`);
      }

      return {
        orderId: newOrder.id,
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
        priceAtTime: currentPrice, // Captured exactly at the moment of ordering
      };
    });

    await db.insert(schema.orderItems).values(orderItemsToInsert).execute();

    console.log("--- [END] POST /api/orders SUCCESS ---\n");
    
    return Response.json({
      success: true,
      order: newOrder,
      itemsCount: orderItemsToInsert.length
    }, { status: 201 });

  } catch (error: any) {
    console.error("\n--- [ERROR] POST /api/orders FAILED ---", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// GET: Fetch all orders (Optional: for Admin dashboard)
// ==========================================
export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB, { schema });

    // Fetches orders ordered by most recent first
    const result = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .all();

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}