import Image from "next/image";

// Aligned with your SQLite Schema
type ItemProps = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: string; // "Item" or "Service"
  artistName?: string; 
};

interface MenuProps {
  item: ItemProps;
  imageSrc: string;
}

export default function Menu({ item, imageSrc }: MenuProps) {
  // Helper to format IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card bg-base-300 w-80 rounded-2xl border border-base-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
      
      {/* 1. Image Section */}
      <figure className="relative w-full h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          unoptimized 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type Badge Overlay */}
        <div className="absolute top-3 right-3">
          <span className={`badge badge-sm font-bold shadow-sm ${
            item.type === "Service" ? "badge-secondary" : "badge-primary"
          }`}>
            {item.type}
          </span>
        </div>
      </figure>
      
      {/* 2. Content Section */}
      <div className="card-body p-5 gap-1">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg font-bold leading-tight">{item.name}</h2>
          <span className="text-primary font-mono font-bold whitespace-nowrap">
            {formatIDR(item.price)}
          </span>
        </div>
        
        {item.artistName && (
          <p className="text-xs text-base-content/60 font-medium mb-2">
            by {item.artistName}
          </p>
        )}
        
        {item.description ? (
          <p className="text-sm text-base-content/80 line-clamp-2 min-h-[2.5rem]">
            {item.description}
          </p>
        ) : (
          <p className="text-sm text-base-content/40 italic">
            No description provided.
          </p>
        )}

        {/* Action area */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm btn-block rounded-xl">
            View Details
          </button>
        </div>
      </div>
      
    </div>
  );
}