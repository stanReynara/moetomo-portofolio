import Polaroid from "@components/Polaroid";
import { getDb } from "@/db/index"; 
import { artists } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare"; 

export default async function PolaroidGallery() {
  const { env } = await getCloudflareContext();

  const db = getDb(env);

  const fetchedArtists = await db.select().from(artists);

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