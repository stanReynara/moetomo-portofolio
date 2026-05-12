export const dynamic = "force-dynamic";
import PolaroidGallery from "@components/PolaroidGallery";
import MenuGallery from "@components/MenuGallery";
import Hero from "@components/Hero";

export default function Main() {
  return (
    <>
      <Hero/>
      <div className="flex flex-wrap justify-center gap-24 px-4 py-8 mb-16">
        <PolaroidGallery />
      </div>
      
      <h2 className="text-3xl font-bold text-center">Menu for the Day</h2>
      
      {/* Updated the grid to hold the single dynamic gallery component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-8 px-4 py-8 mb-16 max-w-7xl mx-auto">
        <MenuGallery />
      </div>
    </>
  );
}