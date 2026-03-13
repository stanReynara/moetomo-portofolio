import Image from "next/image";
import { FaTwitter, FaInstagram } from "react-icons/fa";

export default function Polaroid({
  title,
  description,
  socials,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
  socials: Record<string, string>; // e.g., { "instagram": "link", "twitter": "link" }
}) {
  return (
    <div className="card w-64 bg-base-100 shadow-xl p-3 border border-base-300 transform hover:scale-105 transition-transform duration-300">
      
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-4 border-content">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-contain" 
        />
      </div>

      <div className="pt-4 pb-2 px-1 text-center">
        <h3 className="card-title text-base-content justify-center">{title}</h3>
        <p className="text-sm text-base-content/70 italic mb-3">{description}</p>
        
        <div className="flex justify-center space-x-4">
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm hover:text-pink-500">
              <FaInstagram size={20} />
            </a>
          )}
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm hover:text-blue-400">
              <FaTwitter size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}