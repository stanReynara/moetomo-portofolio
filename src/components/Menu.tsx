import Image from "next/image";

// This component is to showcase the artworks of the artists. It will be an image, with the title of the artwork and the name of the artist below it.
export default function Menu() {
  return (
    <div className="card bg-base-300 w-80 rounded-2xl border border-base-200">
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">Artwork Title</h2>
        <p className="text-sm text-gray-500">by Artist Name</p>
      </div>
      <Image
        src="/artwork.png"
        alt="Artwork"
        width={320}
        height={240}
        className="object-cover w-full h-auto rounded-b-2xl"
      />
    </div>
  );
}
