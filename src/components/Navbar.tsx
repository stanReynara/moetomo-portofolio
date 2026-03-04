import Image from "next/image";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <h1 className="text-2xl font-bold">HOME</h1>
      </div>
      <div className="navbar-center">
        <Image src="/logo.png" alt="Logo" width={256} height={32} className="mr-2" />
      </div>
      <div className="navbar-end">
        <h1 className="text-2xl font-bold">CONTACT US</h1>
      </div>
    </div>
  );
}
