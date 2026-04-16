import Image from "next/image";
import EditArtistModal from "@/components/admin/EditArtistModal";

// Define the type based on your schema output
type Artist = {
  id: number;
  name: string;
  avatar: string | null;
  polaroid: string | null;
  description: string | null;
  socials: Record<string, string> | null;
  createdAt: Date | number;
};

interface ArtistsTableProps {
  artists: Artist[];
}

export default function ArtistTable({ artists }: ArtistsTableProps) {
  const BASE_IMAGE_URL = "https://pub-92760cc6862345509bd9b0867e90c2c6.r2.dev";

  return (
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
          {artists.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-8 text-base-content/50"
              >
                No artists found. Click the button above to add one!
              </td>
            </tr>
          ) : (
            artists.map((artist) => {
              // Construct the R2 image path perfectly
              const cleanPath = artist.avatar?.startsWith("/")
                ? artist.avatar
                : `/${artist.avatar}`;

              const finalImageSrc = artist.avatar
                ? `${BASE_IMAGE_URL}${cleanPath}`
                : "/default-placeholder.png";

              // Safely handle the JSON socials object
              const socialsMap = (artist.socials as Record<string, string>) || {};

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
                    <EditArtistModal artist={artist} />
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