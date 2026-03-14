import Polaroid from "@components/Polaroid";
import { getDb } from "@/db/index"; 
import { isNull } from "drizzle-orm";
import { artists } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare"; 

export default async function PolaroidGallery() {
  const { env } = await getCloudflareContext({ async: true });

  const db = getDb(env);
  // Fetch all artists with deletedAt = null
  const fetchedArtists = await db.select().from(artists).where(isNull(artists.deletedAt));

  return (
    <>
      {fetchedArtists.map((artist) => (
        <Polaroid 
          key={artist.id} 
        title={artist.name} 
          description={artist.description || ""} 
          imageSrc={artist.polaroid || "/"} 
          socials={artist.socials || {}} 
        />
      ))}
    </>
  );
}