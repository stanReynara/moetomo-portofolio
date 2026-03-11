import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-col w-full">
      
      <div className="py-4 px-6 bg-white w-full flex justify-center"> 
        <Image
          src="/logo.png"
          alt="Logo"
          width={256}
          height={48}
        />
      </div>

      <div className="relative w-full">
        <Image
          src="/hero.png"
          alt="Hero Banner"
          width={1920}
          height={600}
          className="w-full h-auto block"
          priority
        />
      </div>
      
    </div>
  );
}