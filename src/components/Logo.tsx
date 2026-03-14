import React from "react";
import Image from "next/image";

export default function Logo({}) {
  return (
    <div className="py-4 px-6 bg-white w-full flex justify-center border-b border-gray-200 ">
      <Image src="/logo.png" alt="Logo" width={256} height={48} />
    </div>
  );
}