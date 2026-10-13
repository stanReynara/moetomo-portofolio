import ItemGallery from "@/components/ItemGallery";
// import ShopHeader from "@/components/shop/ShopHeader";

export const dynamic = "force-dynamic";

export default function Shop() {
  return (
    <div className="min-h-screen bg-base-100 pb-24 text-base-content">
      {/* <ShopHeader /> */}
      <section aria-label="Shop catalog" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <ItemGallery />
      </section>
    </div>
  );
}
