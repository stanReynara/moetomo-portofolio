import Menu from "@/components/Item";
import { getDb } from "@/db/index";
import { isNull } from "drizzle-orm";
import { items } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { unstable_cache } from "next/cache";

export default async function ItemGallery() {
  // 1. Get the context/env
  const { env } = await getCloudflareContext({ async: true });

  // 2. Cache the database query
  const getCachedItems = unstable_cache(
    async () => {
      const db = getDb(env);
      return await db.select().from(items).where(isNull(items.deletedAt));
    },
    ['active-items-query'],
    { tags: ['items-data'] }
  );

  const fetchedItems = await getCachedItems();

  // 3. SINGLE SOURCE OF TRUTH for images
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL || "";

  return (
    <>
      {fetchedItems.map((item) => {
        // Handle the leading slash issue
        const cleanPath = item.imageUrl?.startsWith('/')
          ? item.imageUrl
          : `/${item.imageUrl}`;

        // Construct the final image source
        const finalImageSrc = item.imageUrl
          ? `${BUCKET_URL}${cleanPath}`
          : "/default-placeholder.png";

        return (
          <Menu
            key={item.id}
            item={item}
            imageSrc={finalImageSrc}
          />
        );
      })}
    </>
  );
}