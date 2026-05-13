"use client";

import Image from "next/image";
import { useCart } from "./CartProvider"; // <-- Import the hook

export type ItemProps = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: string;
  artistName?: string; 
};

interface MenuProps {
  item: ItemProps;
  imageSrc: string;
}

export default function Item({ item, imageSrc }: MenuProps) {
  const { addToCart } = useCart(); // <-- Get the function from context

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card bg-base-100 border-2 border-base-300 rounded-2xl shadow-lg group hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-sm">
      
      {/* 1. Image Section */}
      <figure className="relative w-full h-64 overflow-hidden bg-base-200">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          unoptimized 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 right-4">
          <span className={`badge border-none font-bold shadow-md px-3 py-3 text-xs tracking-wide ${
            item.type === "Service" ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"
          }`}>
            {item.type}
          </span>
        </div>
      </figure>
      
      {/* 2. Content Section */}
      <div className="card-body p-6 gap-2">
        <div className="flex justify-between items-start gap-3">
          <h2 className="card-title text-xl font-extrabold text-base-content leading-tight">
            {item.name}
          </h2>
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-mono font-bold text-sm whitespace-nowrap">
            {formatIDR(item.price)}
          </span>
        </div>
        
        {item.artistName && (
          <p className="text-xs text-base-content/70 font-semibold uppercase tracking-wider mb-1">
            By <span className="text-base-content">{item.artistName}</span>
          </p>
        )}
        
        {item.description ? (
          <p className="text-sm text-base-content/80 line-clamp-2 min-h-[2.5rem] mt-1 leading-relaxed">
            {item.description}
          </p>
        ) : (
          <p className="text-sm text-base-content/40 italic mt-1">
            No description provided.
          </p>
        )}

        {/* Action area */}
        <div className="card-actions justify-end mt-5">
          <button 
            onClick={() => addToCart(item)} 
            className="btn btn-primary btn-block rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}