import Image from "next/image";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <h1 className="relative w-fit cursor-pointer text-2xl font-bold text-base-content 
                      after:absolute after:bottom-0 after:left-[10%] after:h-0.5 after:w-[80%] 
                      after:origin-center after:scale-x-0 after:bg-gray-400 
                      after:shadow-[0_5px_10px_rgba(156,163,175,0.8)]
                      after:transition-transform after:duration-300 after:content-[''] 
                      hover:after:scale-x-100">
          HOME
        </h1>
      </div>
      <div className="navbar-center">
        <Image src="/logo.png" alt="Logo" width={256} height={32} className="mr-2" />
      </div>
      <div className="navbar-end">
        <h1 className="relative w-fit cursor-pointer text-2xl font-bold text-base-content 
                      after:absolute after:bottom-0 after:left-[10%] after:h-0.5 after:w-[80%] 
                      after:origin-center after:scale-x-0 after:bg-gray-400 
                      after:shadow-[0_5px_10px_rgba(156,163,175,0.8)]
                      after:transition-transform after:duration-300 after:content-[''] 
                      hover:after:scale-x-100">
          CONTACT US
        </h1>
      </div>
    </div>
  );
}