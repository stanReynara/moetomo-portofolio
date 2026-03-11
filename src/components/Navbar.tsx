import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link 
          href="/" 
          className="relative w-fit cursor-pointer text-2xl font-bold text-base-content 
                    after:absolute after:bottom-0 after:left-[10%] after:h-0.5 after:w-[80%] 
                    after:origin-center after:scale-x-0 after:bg-gray-400 
                    after:shadow-[0_5px_10px_rgba(156,163,175,0.8)]
                    after:transition-transform after:duration-300 after:content-[''] 
                    hover:after:scale-x-100"
        >
          HOME
        </Link>
      </div>
      
      <div className="navbar-center">
        <Link 
          href="/contact" 
          className="relative w-fit cursor-pointer text-2xl font-bold text-base-content 
                    after:absolute after:bottom-0 after:left-[10%] after:h-0.5 after:w-[80%] 
                    after:origin-center after:scale-x-0 after:bg-gray-400 
                    after:shadow-[0_5px_10px_rgba(156,163,175,0.8)]
                    after:transition-transform after:duration-300 after:content-[''] 
                    hover:after:scale-x-100"
        >
          CONTACT US
        </Link>
      </div>
      
      <div className="navbar-end">
        <Link 
          href="/shop" 
          className="relative w-fit cursor-pointer text-2xl font-bold text-base-content 
                    after:absolute after:bottom-0 after:left-[10%] after:h-0.5 after:w-[80%] 
                    after:origin-center after:scale-x-0 after:bg-gray-400 
                    after:shadow-[0_5px_10px_rgba(156,163,175,0.8)]
                    after:transition-transform after:duration-300 after:content-[''] 
                    hover:after:scale-x-100"
        >
          SHOP
        </Link>
      </div>
    </div>
  );
}