import { getDb } from "@/db/index";
import { isNull } from "drizzle-orm";
import { items } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import ShopCatalog from "@/components/shop/ShopCatalog";

export default async function ItemGallery() {
  const { env } = await getCloudflareContext({ async: true });
  const fetchedItems = await getDb(env).select().from(items).where(isNull(items.deletedAt));
  const bucketUrl = (process.env.NEXT_PUBLIC_BUCKET_URL || "").replace(/\/+$/, "");

  return <ShopCatalog items={fetchedItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    type: item.type,
    imageSrc: item.imageUrl?.trim()
      ? `${bucketUrl}/${item.imageUrl.trim().replace(/^\/+/, "")}`
      : null,
  }))} />;
}
