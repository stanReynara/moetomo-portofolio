import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero relative w-full">
      <Image
        src="/hero.png"
        alt="Hero Banner"
        width={1920} // Use the actual width of your image
        height={600}  // Use the actual height of your image
        className="w-full h-auto" // Forces width to 100% and scales height automatically
        priority // Ensures the hero loads fast
      />
    </div>
  );
}