// src/app/admin/artists/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { isNull, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import EditArtistModal from "@/components/admin/EditArtistModal";

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

  // 3. Set up the R2 CDN base URL
  const BASE_IMAGE_URL = "https://pub-92760cc6862345509bd9b0867e90c2c6.r2.dev";

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
        <Link href="/admin/artists/new" className="btn btn-primary">
          + Add New Artist
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
                  <th>Artist</th>
                  <th>Bio / Description</th>
                  <th>Socials</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {fetchedArtists.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-base-content/50"
                    >
                      No artists found. Click the button above to add one!
                    </td>
                  </tr>
                ) : (
                  fetchedArtists.map((artist) => {
                    // Construct the R2 image path perfectly
                    const cleanPath = artist.avatar?.startsWith("/")
                      ? artist.avatar
                      : `/${artist.avatar}`;

                    const finalImageSrc = artist.avatar
                      ? `${BASE_IMAGE_URL}${cleanPath}`
                      : "/default-placeholder.png";

                    // Safely handle the JSON socials object
                    const socialsMap = artist.socials || {};

                    return (
                      <tr key={artist.id} className="hover">
                        {/* 1. Combined Avatar and Name */}
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2 relative">
                                <Image
                                  src={finalImageSrc}
                                  alt={artist.name}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">
                                {artist.name}
                              </div>
                              {/* Show a small indicator if they have a polaroid uploaded */}
                              <div className="text-sm opacity-60">
                                {artist.polaroid
                                  ? "🖼️ Polaroid Active"
                                  : "No Polaroid"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Truncated Description */}
                        <td className="max-w-xs">
                          {artist.description ? (
                            <div
                              className="truncate opacity-80"
                              title={artist.description}
                            >
                              {artist.description}
                            </div>
                          ) : (
                            <span className="opacity-40 italic">
                              No description
                            </span>
                          )}
                        </td>

                        {/* 3. Social Media Badges */}
                        <td>
                          {Object.keys(socialsMap).length > 0 ? (
                            <div className="flex gap-1 flex-wrap">
                              {Object.entries(socialsMap).map(
                                ([platform, link]) => (
                                  <a
                                    key={platform}
                                    href={link as string}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="badge badge-ghost badge-sm capitalize hover:badge-primary transition-colors cursor-pointer"
                                    title={`Visit ${platform}`}
                                  >
                                    {platform}
                                  </a>
                                ),
                              )}
                            </div>
                          ) : (
                            <span className="opacity-40 text-sm">None</span>
                          )}
                        </td>

                        {/* 4. Joined Date */}
                        <td className="whitespace-nowrap opacity-80">
                          {new Date(artist.createdAt).toLocaleDateString(
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
                          {/* Pass the entire artist object to the modal */}
                          <EditArtistModal artist={artist} />
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
