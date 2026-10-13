import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, Palette, ShoppingBag, Sparkles } from "lucide-react";
import { FaInstagram as Instagram, FaTwitter } from "react-icons/fa";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { artists } from "@/db/schema";

export const dynamic = "force-dynamic";

const accents = ["bg-primary/25", "bg-secondary/25", "bg-accent/25"];

function socialUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default async function Contact() {
  const { env } = await getCloudflareContext({ async: true });
  const team = await getDb(env).select().from(artists).where(isNull(artists.deletedAt));
  const bucketUrl = (process.env.NEXT_PUBLIC_BUCKET_URL || "").replace(/\/+$/, "");

  return (
    <div className="bg-base-100 text-base-content">
      <header className="border-b-2 border-dashed border-base-300 bg-secondary/10 px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <span className="badge badge-secondary gap-2 px-4 py-3 font-semibold">
            <Sparkles size={16} aria-hidden="true" /> FROM YOUR IMAGINATION, WITH LOVE
          </span>
          <h1 className="mt-5 text-4xl font-black sm:text-5xl">Contact us<span className="text-secondary">!</span></h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-base-content/75">
            An original character? A dream collab? A little hello?
            We&apos;d love to hear what you&apos;re dreaming up.
          </p>
          <div className="mt-5 flex justify-center gap-5 text-base-content/60" aria-hidden="true">
            <Palette size={22} /><Heart size={22} /><MessageCircle size={22} />
          </div>
        </div>
      </header>

      <section aria-labelledby="artists-heading" className="mx-auto max-w-5xl px-5 py-10 sm:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-base-content/60">The people behind the pixels</p>
            <h2 id="artists-heading" className="text-2xl font-extrabold">Say hi to the artists</h2>
          </div>
          <span className="badge badge-outline gap-2"><Heart size={14} aria-hidden="true" /> Made with personality</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((artist, index) => {
            const key = artist.avatar?.trim().replace(/^\/+/, "");
            const image = key ? `${bucketUrl}/${key.includes("/") ? key : `avatars/${key}`}` : null;
            const instagram = socialUrl(artist.socials?.instagram);
            const twitter = socialUrl(artist.socials?.twitter);
            return (
              <article key={artist.id} className="card overflow-hidden rounded-lg border-2 border-base-content/15 bg-base-100 shadow-sm">
                <div className={`relative flex h-48 items-center justify-center border-b-2 border-base-content/10 ${accents[index % accents.length]}`}>
                  <span className="badge badge-neutral absolute left-3 top-3 font-mono text-xs">ARTIST / {String(index + 1).padStart(2, "0")}</span>
                  <Sparkles className="absolute bottom-4 right-4 text-base-content/40" size={26} aria-hidden="true" />
                  {image ? (
                    <Image src={image} alt={`${artist.name}'s avatar`} width={144} height={144} unoptimized className="h-36 w-36 rounded-full border-4 border-base-100 bg-base-100 object-contain shadow-md" />
                  ) : (
                    <div className="avatar avatar-placeholder"><div className="w-32 rounded-full bg-base-100 text-4xl font-black"><span>{artist.name.slice(0, 1)}</span></div></div>
                  )}
                </div>
                <div className="card-body gap-3 p-5">
                  <h3 className="card-title break-words text-xl">{artist.name}</h3>
                  <p className="break-words text-sm leading-relaxed text-base-content/70">{artist.description || "A little imagination goes a long way. Let's make something together."}</p>
                  <div className="card-actions mt-3 flex-col gap-2">
                    {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full rounded-lg"><Instagram size={18} aria-hidden="true" /> Instagram <ArrowUpRight size={16} aria-hidden="true" /></a>}
                    {twitter && <a href={twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full rounded-lg"><FaTwitter size={18} aria-hidden="true" /> Twitter / X <ArrowUpRight size={16} aria-hidden="true" /></a>}
                    {!instagram && !twitter && <p className="text-sm text-base-content/60">Social links coming soon.</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {team.length === 0 && <div className="py-12 text-center"><Palette className="mx-auto mb-3 text-secondary" size={32} aria-hidden="true" /><p>Our artist introductions are on the way. Come back soon!</p></div>}
      </section>

      <section className="border-t border-base-300 bg-accent/15 px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div><h2 className="text-xl font-bold">Spotted something you love?</h2><p className="mt-1 text-sm text-base-content/70">Find prints, little treasures, and more in our shop.</p></div>
          <Link href="/shop" className="btn btn-accent shrink-0 rounded-lg"><ShoppingBag size={18} aria-hidden="true" /> Visit the shop <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
