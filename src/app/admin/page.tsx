import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { desc, count } from "drizzle-orm";
import * as schema from "@db/schema"; // Make sure this path matches your setup

export const dynamic = "force-dynamic"; // Ensures the dashboard always shows fresh data

export default async function AdminDashboard() {
  // 1. Initialize DB from Cloudflare Context
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  // 2. Fetch High-Level Stats
  const [totalOrders] = await db.select({ count: count() }).from(schema.orders);
  const [totalItems] = await db.select({ count: count() }).from(schema.items);
  const [totalArtists] = await db.select({ count: count() }).from(schema.artists);

  // 3. Fetch Recent Orders (Limit to 5)
  const recentOrders = await db.query.orders.findMany({
    orderBy: [desc(schema.orders.createdAt)],
    limit: 5,
  });

  // 4. Fetch Recent Items (Limit to 5)
  const recentItems = await db.query.items.findMany({
    orderBy: [desc(schema.items.createdAt)],
    limit: 5,
  });

  // 5. Fetch Roster of Artists (Limit to 5)
  const artistRoster = await db.query.artists.findMany({
    orderBy: [desc(schema.artists.createdAt)],
    limit: 5,
  });

  // Helper function to format IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-base-content/70">Welcome back. Here is what is happening with the store.</p>
      </div>

      {/* --- STATS ROW --- */}
      <div className="stats shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value text-primary">{totalOrders.count}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Active Items</div>
          <div className="stat-value text-secondary">{totalItems.count}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Artists on Roster</div>
          <div className="stat-value">{totalArtists.count}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- RECENT ORDERS --- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-gray-500">No orders yet.</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="font-bold">{order.customerName}</div>
                          <div className="text-sm opacity-50">{order.customerEmail}</div>
                        </td>
                        <td>
                          <div className={`badge ${
                            order.status === 'PENDING' ? 'badge-warning' : 
                            order.status === 'COMPLETED' ? 'badge-success' : 'badge-ghost'
                          }`}>
                            {order.status}
                          </div>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- ITEMS & ARTISTS STACK --- */}
        <div className="space-y-8">
          
          {/* Items Table */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Latest Items</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-gray-500">No items found.</td></tr>
                    ) : (
                      recentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td><span className="badge badge-outline badge-sm">{item.type}</span></td>
                          <td className="font-mono">{formatIDR(item.price)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Artists Table */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Artist Roster</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistRoster.length === 0 ? (
                      <tr><td colSpan={2} className="text-center text-gray-500">No artists added.</td></tr>
                    ) : (
                      artistRoster.map((artist) => (
                        <tr key={artist.id}>
                          <td className="font-bold">{artist.name}</td>
                          <td>{new Date(artist.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}