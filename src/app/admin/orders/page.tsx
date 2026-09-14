import { requireAdminPage } from "@/lib/admin-page";
// src/app/admin/orders/page.tsx
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { isNull, desc } from "drizzle-orm";
import * as schema from "@/db/schema";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdminPage();
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  // Fetch orders, items, AND the artists associated with those items
  const fetchedOrders = await db.query.orders.findMany({
    where: isNull(schema.orders.deletedAt),
    orderBy: [desc(schema.orders.createdAt)],
    with: {
      orderItems: {
        with: {
          item: {
            with: {
              itemArtists: {
                with: {
                  artist: true, // Pulls the artist details for filtering
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Order Management</h1>
          <p className="text-base-content/70">
            Review incoming requests, track item sales, and update statuses.
          </p>
        </div>
      </div>

      {/* Main Interactive Client Component */}
      <OrdersTable initialOrders={fetchedOrders} />
    </div>
  );
}