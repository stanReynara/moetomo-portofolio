import Image from "next/image";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Card({
  title,
  description,
  socials,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
  socials: {
    twitter: string;
    instagram: string;
  };
}) {
  return (
    <div className="card relative bg-base-300 w-96 rounded-2xl border border-base-200">
      <div className="card-body p-8">
        <h2 className="card-title text-2xl font-bold base-content">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
        
        <div className="card-actions justify-end mt-4">
          <a href={socials.twitter} className="btn btn-ghost btn-circle btn-sm hover:text-blue-400">
            <FaTwitter size={20} />
          </a>
          <a href={socials.instagram} className="btn btn-ghost btn-circle btn-sm hover:text-pink-500">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2">
        <Image
          src={imageSrc}
          alt={title}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}