"use client";

import { useState } from "react";
import { Search, SearchX, Sparkles, X } from "lucide-react";
import Item, { type ItemProps } from "@/components/Item";

export type CatalogItem = ItemProps & { imageSrc: string | null };

export default function ShopCatalog({ items }: { items: CatalogItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const categories = [...new Set(items.map((item) => item.type))].sort();
  const visible = items.filter((item) =>
    (category === null || item.type === category) &&
    `${item.name} ${item.description ?? ""} ${item.type}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : b.id - a.id);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Sparkles className="text-secondary" aria-hidden="true" /> Find your next favorite</h2>
        <span className="text-sm text-base-content/60" role="status">{visible.length} {visible.length === 1 ? "item" : "items"}</span>
      </div>
      <div className="mb-7 space-y-4 border-b border-base-300 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="input w-full flex-1 rounded-lg"><Search size={18} aria-hidden="true" /><input aria-label="Search items" type="search" placeholder="Find a little joy..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <select aria-label="Sort items" className="select w-full rounded-lg sm:w-48" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Item categories">
          {[null, ...categories].map((value) => <button type="button" key={value ?? "all-items"} aria-pressed={category === value} onClick={() => setCategory(value)} className={`btn btn-sm rounded-lg ${category === value ? "btn-secondary" : "btn-ghost"}`}>{value ?? "All items"}</button>)}
        </div>
      </div>
      {visible.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((item) => <Item key={item.id} item={item} imageSrc={item.imageSrc} />)}</div> : (
        <div className="py-16 text-center">
          <SearchX size={40} className="mx-auto mb-4 text-secondary" aria-hidden="true" />
          <h3 className="text-xl font-bold">{items.length ? "No little treasures found" : "Something lovely is on its way"}</h3>
          <p className="mt-2 text-sm text-base-content/65">{items.length ? "Try another search or explore the whole collection." : "Our artists are getting the collection ready. Check back soon."}</p>
          {items.length > 0 && <button type="button" className="btn btn-outline mt-5 rounded-lg" onClick={() => { setQuery(""); setCategory(null); }}><X size={16} aria-hidden="true" /> Clear filters</button>}
        </div>
      )}
    </>
  );
}
