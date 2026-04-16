// src/app/admin/artists/page.tsx
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { isNull, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import AddArtistModal from "@/components/admin/AddArtistModal";
import ArtistsTable from "@/components/admin/ArtistsTable";

export const dynamic = "force-dynamic"; // Ensures we always see fresh D1 data

export default async function AdminArtistsPage() {
  // 1. Initialize DB from Cloudflare Context
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB, { schema });

  // 2. Fetch all active artists
  const fetchedArtists = await db
    .select()
    .from(schema.artists)
    .where(isNull(schema.artists.deletedAt))
    .orderBy(desc(schema.artists.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Artist Roster</h1>
          <p className="text-base-content/70">
            Manage the artists featured in your gallery.
          </p>
        </div>
        <AddArtistModal />
      </div>

      {/* Main Table Card */}
      <div className="card bg-base-100 shadow-xl overflow-visible">
        <div className="card-body p-0">
          {/* Inject the extracted table component */}
          <ArtistsTable artists={fetchedArtists} />
        </div>
      </div>
    </div>
  );
}