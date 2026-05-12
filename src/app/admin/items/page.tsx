// src/app/admin/items/page.tsx
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { isNull, desc } from "drizzle-orm";
import * as schema from "@/db/schema";
import AddItemModal from "@/components/admin/AddItemModal";
import ItemsTable from "@/components/admin/ItemsTable"; // Assuming you have or will create this

export const dynamic = "force-dynamic";

export default async function AdminItemsPage() {
  // 1. Initialize DB from Cloudflare Context
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  // 2. Fetch all active items
  const fetchedItems = await db
    .select()
    .from(schema.items)
    .where(isNull(schema.items.deletedAt))
    .orderBy(desc(schema.items.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Item Management</h1>
          <p className="text-base-content/70">
            Manage the merchandise and services available in your store.
          </p>
        </div>
        <AddItemModal />
      </div>

      {/* Main Table Card */}
      <div className="card bg-base-100 shadow-xl overflow-visible">
        <div className="card-body p-0">
          {/* Inject the extracted table component */}
          <ItemsTable items={fetchedItems} />
        </div>
      </div>
    </div>
  );
}