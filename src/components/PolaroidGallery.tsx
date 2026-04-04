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

  // 4. Define your Base Image URL
  // If you are using an API route as a proxy: const BASE_IMAGE_URL = "/api/images";
  // If using your public R2 custom domain:
  const BASE_IMAGE_URL = "https://pub-92760cc6862345509bd9b0867e90c2c6.r2.dev/avatars"; // Replace with your actual CDN domain

  return (
    <>
      {fetchedArtists.map((artist) => {
        // Handle the leading slash issue. 
        const cleanPath = artist.avatar?.startsWith('/') 
          ? artist.avatar 
          : `/${artist.avatar}`;

        // Construct the final image source
        const finalImageSrc = artist.avatar 
          ? `${BASE_IMAGE_URL}${cleanPath}` 
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