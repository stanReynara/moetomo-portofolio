"use client";

import Image from "next/image";
import { ImageOff, Palette, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

export type ItemProps = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: string;
  artistName?: string;
};

export default function Item({ item, imageSrc }: { item: ItemProps; imageSrc: string | null }) {
  const { addToCart, cart } = useCart();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const quantity = cart.find((entry) => entry.id === item.id)?.quantity ?? 0;
  const isService = item.type.toLowerCase() === "service";
  return (
    <article className="card h-full w-full overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-lg">
      <figure className={`relative aspect-square w-full shrink-0 ${isService ? "bg-secondary/15" : "bg-accent/20"}`}>
        {imageSrc && failedImage !== imageSrc ? (
          <Image src={imageSrc} alt={item.name} fill unoptimized className="object-contain p-3" onError={() => setFailedImage(imageSrc)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-base-content/50">
            {isService ? <Palette size={44} aria-hidden="true" /> : <ImageOff size={44} aria-hidden="true" />}
            <span className="text-sm">{isService ? "Made just for you" : "Image coming soon"}</span>
          </div>
        )}
        <span className={`badge absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate ${isService ? "badge-secondary" : "badge-primary"}`}>{item.type}</span>
      </figure>
      <div className="card-body gap-3 p-5">
        <h3 className="card-title break-words text-lg">{item.name}</h3>
        {item.artistName && <p className="text-xs text-base-content/60">By {item.artistName}</p>}
        {item.description && <p className="break-words text-sm leading-relaxed text-base-content/70">{item.description}</p>}
        <div className="mt-auto pt-3">
          <p className="mb-3 text-lg font-extrabold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}</p>
          <button type="button" onClick={() => addToCart(item)} className={`btn w-full rounded-lg ${isService ? "btn-secondary" : "btn-primary"}`}>
            {quantity ? <Plus size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
            {quantity ? "Add another" : "Add to cart"}
          </button>
          <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs text-base-content/60">{quantity ? `${quantity} in your cart` : ""}</p>
        </div>
      </div>
    </article>
  );
}
