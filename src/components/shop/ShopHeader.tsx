import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";

export default function ShopHeader() {
  return (
    <header className="border-b-2 border-dashed border-base-300">
      <div className="bg-accent/20 px-4 py-7 text-center sm:py-10">
        <span className="badge badge-secondary gap-2 font-semibold"><Sparkles size={14} aria-hidden="true" /> THE MOETOMO COLLECTION</span>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Moetomo shop</h1>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-base-content/70">Art to take home, characters to fall for, and something a little more you.</p>
      </div>
      <Image src="/hero.png" alt="Moetomo artist collection" width={1920} height={600} priority className="block h-auto w-full" />
      <div className="flex items-center justify-center gap-2 bg-secondary/15 px-4 py-3 text-center text-sm font-medium"><Heart size={16} className="shrink-0" aria-hidden="true" /> From our artists, with love.</div>
    </header>
  );
}
