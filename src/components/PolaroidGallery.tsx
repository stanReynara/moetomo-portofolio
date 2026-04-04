import Polaroid from "@components/Polaroid";
import { getDb } from "@/db/index"; 
import { isNull } from "drizzle-orm";
import { artists } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare"; 
import { unstable_cache } from "next/cache";

export default async function PolaroidGallery() {
  // 1. Get the context/env first (must be outside the cache function)
  const { env } = await getCloudflareContext({ async: true });

  // 2. Wrap the D1 database call in the Next.js cache
  const getCachedArtists = unstable_cache(
    async () => {
      const db = getDb(env);
      return await db.select().from(artists).where(isNull(artists.deletedAt));
    },
    ['active-artists-query'], 
    { tags: ['artists-data'] }
  );

  // 3. Execute the cached function. 
  const fetchedArtists = await getCachedArtists();

  // Define your R2 Public URL (from the previous step)
  const R2_URL = `api/images/${artists.avatar}`;

  return (
    <>
      {fetchedArtists.map((artist) => (
        <Polaroid 
          key={artist.id} 
          title={artist.name} 
          description={artist.description || ""} 
          // 4. Dynamically append the R2 bucket URL to the stored filename
          imageSrc={artist.polaroid ? `${R2_URL}/${artist.polaroid}` : "/default-placeholder.png"} 
          socials={artist.socials || {}} 
        />
      ))}
    </>
  );
}