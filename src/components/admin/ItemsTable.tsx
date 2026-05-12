import Image from "next/image";
import EditItemModal from "@components/admin/EditItemModal"; // You'll need to create this similar to EditArtistModal

// Define the type based on your items schema
type Item = { 
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: string;
  imageUrl: string | null;
  createdAt: Date | number;
};

interface ItemsTableProps {
  items: Item[];
}

export default function ItemsTable({ items }: ItemsTableProps) {
  // SINGLE SOURCE OF TRUTH: Get the Bucket URL from Environment Variables
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL || "";

  // Helper function to format the price in IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
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
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-8 text-base-content/50"
              >
                No items found. Click the button above to add one!
              </td>
            </tr>
          ) : (
            items.map((item) => {
              // Construct the R2 image path perfectly
              const cleanPath = item.imageUrl?.startsWith("/")
                ? item.imageUrl
                : `/${item.imageUrl}`;

              // Use BUCKET_URL here
              const finalImageSrc = item.imageUrl
                ? `${BUCKET_URL}${cleanPath}`
                : "/default-placeholder.png";

              return (
                <tr key={item.id} className="hover">
                  {/* 1. Combined Thumbnail, Name, and Type */}
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        {/* Using mask-squircle for items instead of a full circle to differentiate from artists */}
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
                          <span
                            className={`badge badge-sm ${
                              item.type.toLowerCase() === "service"
                                ? "badge-secondary"
                                : "badge-primary badge-outline"
                            }`}
                          >
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
                    {/* Assuming you will build EditItemModal */}
                    <EditItemModal item={item} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}