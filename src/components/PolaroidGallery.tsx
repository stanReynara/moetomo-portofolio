import Polaroid from "@components/Polaroid";
import { getDb } from "@/db/index"; 
import { isNull } from "drizzle-orm";
import { artists } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare"; 
import { unstable_cache } from "next/cache";

export default async function PolaroidGallery() {
  // 1. Get the context/env first
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

  // 3. Execute the cached function
  const fetchedArtists = await getCachedArtists();

  // 4. SINGLE SOURCE OF TRUTH: Get the Bucket URL from Environment Variables
  // Local: http://localhost:3000/api/bucket
  // Prod:  https://pub-92760cc6862345509bd9b0867e90c2c6.r2.dev
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL || "";

  return (
    <>
      {fetchedArtists.map((artist) => {
        // Handle the leading slash issue. 
        // (Tip: Change artist.avatar to artist.polaroid if you want the polaroids to show up here!)
        const cleanPath = artist.avatar?.startsWith('/') 
          ? artist.avatar 
          : `/${artist.avatar}`;

        // Construct the final image source using the BUCKET_URL
        const finalImageSrc = artist.avatar 
          ? `${BUCKET_URL}${cleanPath}` 
          : "/default-placeholder.png";

        return (
          <Polaroid 
            key={artist.id} 
            title={artist.name} 
            description={artist.description || ""} 
            imageSrc={finalImageSrc} 
            socials={artist.socials || {}} 
          />
        );
      })}
    </>
  );
}