import ItemGallery from "@/components/ItemGallery";

export default function Shop() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content pb-16">
      
      {/* 1. Hero Header Section */}
      <header className="hero bg-base-200 py-12 md:py-16">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Welcome to the Shop!
            </h1>
            <p className="text-lg text-base-content/70 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti officiis officia eaque corporis aperiam? Corporis tempore ut cupiditate temporibus error.
            </p>
          </div>
        </div>
      </header>

      {/* 2. Gallery Grid Section */}
      <section className="container mx-auto px-4 mt-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-y-10 gap-x-6">
          <ItemGallery />
        </div>
      </section>
      
    </main>
  );
}