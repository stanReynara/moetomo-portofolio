import Link from "next/link";
import Image from "next/image";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { isNull, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import EditItemsModal from "@/components/admin/EditItemsModal"; // Make sure to create this component

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

  // 3. Set up the R2 CDN base URL
  const BASE_IMAGE_URL = "https://pub-92760cc6862345509bd9b0867e90c2c6.r2.dev";

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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Item Management</h1>
          <p className="text-base-content/70">
            Manage the merchandise and services available in your store.
          </p>
        </div>
        <Link href="/admin/items/new" className="btn btn-primary">
          + Add New Item
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="card bg-base-100 shadow-xl overflow-visible">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* Table Head */}
              <thead className="bg-base-200/50 text-base-content">
                <tr>
                  <th>Item Details</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Added Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {fetchedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-base-content/50"
                    >
                      No items found. Click the button above to add one!
                    </td>
                  </tr>
                ) : (
                  fetchedItems.map((item) => {
                    // Construct the R2 image path perfectly
                    const cleanPath = item.imageUrl?.startsWith("/")
                      ? item.imageUrl
                      : `/${item.imageUrl}`;

                    const finalImageSrc = item.imageUrl
                      ? `${BASE_IMAGE_URL}${cleanPath}`
                      : "/default-placeholder.png";

                    return (
                      <tr key={item.id} className="hover">
                        {/* 1. Thumbnail, Name, and Type Badge */}
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="avatar">
                              {/* Using a rounded square mask for items instead of a circle */}
                              <div className="w-14 h-14 mask mask-squircle bg-base-200 relative">
                                <Image
                                  src={finalImageSrc}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">
                                {item.name}
                              </div>
                              <div className="mt-1">
                                <span className={`badge badge-sm ${
                                  item.type.toLowerCase() === 'service' ? 'badge-secondary' : 'badge-primary badge-outline'
                                }`}>
                                  {item.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Truncated Description */}
                        <td className="max-w-xs">
                          {item.description ? (
                            <div
                              className="truncate opacity-80"
                              title={item.description}
                            >
                              {item.description}
                            </div>
                          ) : (
                            <span className="opacity-40 italic">
                              No description
                            </span>
                          )}
                        </td>

                        {/* 3. Price */}
                        <td className="font-mono font-medium">
                          {formatIDR(item.price)}
                        </td>

                        {/* 4. Added Date */}
                        <td className="whitespace-nowrap opacity-80">
                          {new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>

                        {/* 5. Actions */}
                        <td className="text-right space-x-2">
                          {/* Pass the entire item object to the modal */}
                          <EditItemsModal item={item} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}